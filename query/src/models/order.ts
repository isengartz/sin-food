import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { PaymentMethod } from '@sin-nombre/sinfood-common';

export interface OrderAttrs {
  id: string;
  userId: string;
  restaurantId: string;
  price: number;
  paid_via: PaymentMethod;
  menu_items: {
    item: string;
    quantity: number;
  }[];
  version: number;
  createdAt: Date;
}

export interface OrderDoc extends mongoose.Document {
  id: string;
  userId: string;
  restaurantId: string;
  price: number;
  paid_via: PaymentMethod;
  menu_items: {
    item: string;
    quantity: number;
  }[];
  version: number;
  createdAt: Date;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
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
    paid_via: {
      type: String,
      enum: Object.values(PaymentMethod),
    },
    menu_item: [
      {
        item: {
          type: String,
        },
        quantity: {
          type: Number,
          min: 1,
        },
        _id: false,
      },
    ],
    createdAt: Date,
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    restaurantId: attrs.restaurantId,
    price: attrs.price,
    paid_via: attrs.paid_via,
    menu_item: attrs.menu_items,
    createdAt: attrs.createdAt,
  });
};
orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Add wasNew flag so we can do the check inside post middleware
orderSchema.pre<OrderDoc>('save', function (next) {
  // @ts-ignore
  this.wasNew = this.isNew;
  next();
});

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
