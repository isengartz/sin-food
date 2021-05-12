import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Restaurant } from './restaurant';
import { RestaurantReviewCreatedPublisher } from '../events/publishers/restaurant-review-created-publisher';
import { natsWrapper } from '../events/nats-wrapper';
import { RestaurantReviewUpdatedPublisher } from '../events/publishers/restaurant-review-updated-publisher';

export interface ReviewAttrs {
  orderId: string;
  restaurant: string;
  userId: string;
  rating: Number;
  comment?: string;
}

export interface ReviewDoc extends mongoose.Document {
  id: string;
  orderId: string;
  restaurant: string;
  userId: string;
  rating: Number;
  comment: string;
  version: Number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  },
);

reviewSchema.set('versionKey', 'version');
reviewSchema.plugin(updateIfCurrentPlugin);

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review(attrs);
};

reviewSchema.statics.calcAverageRating = async function (restaurantId: string) {
  const stats = await this.aggregate([
    {
      $match: { restaurant: restaurantId },
    },
    {
      $group: {
        _id: '$restaurant',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      restaurant.set({
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
      await restaurant.save();
    }
  }
};

reviewSchema.pre<ReviewDoc>('save', async function (next) {
  // @ts-ignore
  this.wasNew = this.isNew;

  next();
});

reviewSchema.post<ReviewDoc>('save', async function (doc, next) {
  await doc.constructor.calcAverageRating(doc.restaurant);
  if (doc.wasNew) {
    new RestaurantReviewCreatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      orderId: doc.orderId,
      restaurant: doc.restaurant,
      userId: doc.userId,
      rating: doc.rating,
      comment: doc.comment,
      version: doc.version,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  } else {
    new RestaurantReviewUpdatedPublisher(natsWrapper.client).publish({
      id: doc._id,
      orderId: doc.orderId,
      restaurant: doc.restaurant,
      userId: doc.userId,
      rating: doc.rating,
      comment: doc.comment,
      version: doc.version,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  next();
});

const Review = mongoose.model<ReviewDoc, ReviewModel>('Review', reviewSchema);

export { Review };
