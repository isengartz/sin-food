import { Weekdays } from '@sin-nombre/sinfood-common';

export interface WorkingHoursInterface {
  day: Weekdays;
  open: number;
  close: number;
}
