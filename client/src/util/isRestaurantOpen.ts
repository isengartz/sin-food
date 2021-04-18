import { DateHelper } from '@sin-nombre/sinfood-common';
import { WorkingHoursInterface } from './interfaces/WorkingHoursInterface';

export const isRestaurantOpen = (workingHours: WorkingHoursInterface[]) => {
  const now = DateHelper.DayNowToHours();
  const today = DateHelper.TodayAsInt();

  const isOpen = workingHours
    .filter((wday) => wday.day === today)
    .reduce((acc, current) => {
      if (acc) {
        return true;
      }
      return current.close > now && current.open <= now;
    }, false);
};
