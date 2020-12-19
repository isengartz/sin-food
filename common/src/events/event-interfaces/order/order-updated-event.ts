import { Subjects } from '../../subjects';
import { OrderStatus } from '../../../enums/order-status';

export interface OrderUpdatedEvent {
  subject: Subjects.OrderUpdated;
  data: {
    id: string;
    price: number;
    status: OrderStatus;
    userId: string;
    restaurantId: string;
    version: number;
  };
}
