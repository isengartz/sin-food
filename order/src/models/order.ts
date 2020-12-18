import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@sin-nombre/sinfood-common';
import { calculateFinalOrderPrice } from '../utils/calculate-final-order-price';

interface OrderedMenuItemsOptions {
  excluded_ingredients: string[];
  extra_ingredients: string[];
  quantity: number;
  variation?: string;
}

export interface OrderAttrs {
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  price: number;
  menu_items: {
    item: string;
    item_options: OrderedMenuItemsOptions;
  }[];
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
  created_at: Date;
  updated_at: Date;
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
    menu_items: [
      {
        _id: false,
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

orderSchema.pre<OrderDoc>('save', async function (next) {
  this.price = await calculateFinalOrderPrice(this.menu_items);
  next();
});
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
