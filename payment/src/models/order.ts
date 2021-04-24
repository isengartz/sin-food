import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@sin-nombre/sinfood-common';

export interface OrderAttrs {
  id: string;
  userId: string;
  restaurantId: string;
  price: number;
  status: OrderStatus;
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  price: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
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
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
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
    _id: attrs.id,
    userId: attrs.userId,
    restaurantId: attrs.restaurantId,
    price: attrs.price,
    status: attrs.status,
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
//
// // emit Events on Create / Update
// orderSchema.post<OrderDoc>('save', async function (doc, next) {
//   if (doc.wasNew) {
//     new OrderCreatedPublisher(natsWrapper.client).publish({
//       id: doc._id,
//       price: doc.price,
//       status: doc.status,
//       userId: doc.userId,
//       restaurantId: doc.restaurantId,
//     });
//   } else {
//     new OrderUpdatedPublisher(natsWrapper.client).publish({
//       id: doc._id,
//       price: doc.price,
//       status: doc.status,
//       userId: doc.userId,
//       restaurantId: doc.restaurantId,
//       version: doc.version,
//     });
//   }
//   next();
// });
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
