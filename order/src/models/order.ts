import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@sin-nombre/sinfood-common';
import { MenuItemDoc } from './menu-item';

interface OrderedMenuItemsOptions {
  excluded_ingredients: string[];
  extra_ingredients: string[];
  quantity: number;
}

export interface OrderAttrs {
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  price: number;
  menu_items: {
    item: MenuItemDoc;
    item_options: OrderedMenuItemsOptions;
  }[];
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  price: number;
  menu_items: {
    item: MenuItemDoc;
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
  return new Order({
    price: attrs.price,
    userId: attrs.userId,
    restaurantId: attrs.restaurantId,
    status: attrs.status,
    menu_items: attrs.menu_items,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
