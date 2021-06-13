import { Weekdays } from '@sin-nombre/sinfood-common';
import moment, { Moment } from 'moment';

interface WorkingHoursForm {
  day: Weekdays;
  time: Moment[];
}
interface WorkingHoursAdapted {
  day: Weekdays;
  open: number;
  close: number;
}

export const adaptWorkingHours = (formData: WorkingHoursForm[]): WorkingHoursAdapted[] => {
  if (!formData) return [];
  return formData.map((record) => ({
    day: record.day,
    open: moment(record.time[0]).hours() * 60 + moment(record.time[0]).minutes(), // Convert time to minutes
    close: moment(record.time[1]).hours() * 60 + moment(record.time[1]).minutes(),
  }));
};
