import mongoose from 'mongoose';
import { PaymentMethod } from '@sin-nombre/sinfood-common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PaymentAttrs {
  orderId: string;
  payment_method: PaymentMethod;
  paymentId?: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  payment_method: PaymentMethod;
  paymentId: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    paymentId: {
      type: String,
    },
    payment_method: {
      type: String,
      required: true,
      enum: Object.values(PaymentMethod),
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

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema,
);

export { Payment };
