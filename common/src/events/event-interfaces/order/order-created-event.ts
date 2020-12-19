import { Subjects } from '../../subjects';
import { OrderStatus } from '../../../enums/order-status';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    price: number;
    status: OrderStatus;
    userId: string;
    restaurantId: string;
  };
}
