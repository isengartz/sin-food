import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface ReviewAttrs {
  id: string;
  orderId: string;
  restaurant: string;
  userId: string;
  rating: number;
  comment?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewDoc extends mongoose.Document {
  id: string;
  orderId: string;
  restaurant: string;
  userId: string;
  rating: number;
  comment: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ReviewDoc | null>;
}

const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    restaurant: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

reviewSchema.set('versionKey', 'version');
reviewSchema.plugin(updateIfCurrentPlugin);

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review({
    _id: attrs.id,
    userId: attrs.userId,
    orderId: attrs.orderId,
    restaurant: attrs.restaurant,
    rating: attrs.rating,
    comment: attrs.comment,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
  });
};

reviewSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Review.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Review = mongoose.model<ReviewDoc, ReviewModel>('Review', reviewSchema);

export { Review };
