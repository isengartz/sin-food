import mongoose from 'mongoose';
import { Weekdays } from '@sin-nombre/sinfood-common';

export interface RestaurantWorkingHours {
  day: Weekdays;
  open: number;
  close: number;
}

const restaurantWorkingHoursSchema = new mongoose.Schema({
  day: {
    type: Number,
    enum: Object.values(Weekdays),
  },
  open: Number,
  close: Number,
  _id: { id: false },
});

export { restaurantWorkingHoursSchema };
