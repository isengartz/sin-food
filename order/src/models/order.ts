import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@sin-nombre/sinfood-common';
// eslint-disable-next-line import/no-cycle
import { calculateFinalOrderPrice } from '../utils/calculate-final-order-price';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../events/nats-wrapper';
import { OrderUpdatedPublisher } from '../events/publishers/order-updated-publisher';

interface OrderedMenuItemsOptions {
  excluded_ingredients: string[];
  extra_ingredients: string[];
  quantity: number;
  variation?: string;
  comments?: string;
}

interface OrderAddressInfo {
  full_address: string;
  bell_name: string;
  floor: string;
  phone?: string;
  comments?: string;
}

export interface OrderAttrs {
  userId: string;
  restaurantId: string;
  status?: OrderStatus;
  price?: number;
  menu_items: {
    item: string;
    item_options: OrderedMenuItemsOptions;
  }[];
  address_info: OrderAddressInfo;
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  price: number;
  menu_items: {
    item: string;
    item_options: OrderedMenuItemsOptions;
  }[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
  address_info: OrderAddressInfo;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      min: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    address_info: {
      full_address: {
        type: String,
        required: true,
      },
      bell_name: {
        type: String,
        required: true,
      },
      floor: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
      comments: {
        type: String,
      },
    },
    menu_items: [
      {
        _id: false, // dont need that nasty _id thing here
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Menu_Item',
        },
        item_options: {
          excluded_ingredients: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Ingredient',
            },
          ],
          extra_ingredients: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Ingredient',
            },
          ],
          quantity: Number,
          variation: String,
          comments: String,
        },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  },
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

// we shouldn't trust Frontend for the final price of the order
// so we need to calculate it manually before each save
orderSchema.pre<OrderDoc>('save', async function (next) {
  this.price = await calculateFinalOrderPrice(this.menu_items);
  next();
});

// Add wasNew flag so we can do the check inside post middleware
orderSchema.pre<OrderDoc>('save', function (next) {
  // @ts-ignore
  this.wasNew = this.isNew;
  next();
});

// emit Events on Create / Update
orderSchema.post<OrderDoc>('save', async function (doc, next) {
  if (doc.wasNew) {
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      price: doc.price,
      status: doc.status,
      userId: doc.userId,
      restaurantId: doc.restaurantId,
    });
  } else {
    new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      price: doc.price,
      status: doc.status,
      userId: doc.userId,
      restaurantId: doc.restaurantId,
      version: doc.version,
    });
  }
  next();
});
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
