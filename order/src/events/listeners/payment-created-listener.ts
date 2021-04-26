import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCompletedPublisher } from '../publishers/order-completed-publisher';
import { natsWrapper } from '../nats-wrapper';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId, payment_method, paymentId } = data;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Menu Item not found');
    }

    order.set({ status: OrderStatus.Completed });
    await order.save();

    await order.populate('menu_items.item').execPopulate();

    // Build the menu items payload
    // We only want the item name and quantity
    const menu_items = order.menu_items.map((menu_item) => ({
      // @ts-ignore
      item: menu_item.item.name,
      quantity: menu_item.item_options.quantity,
    }));

    new OrderCompletedPublisher(natsWrapper.client).publish({
      orderId: order.id,
      userId: order.userId,
      restaurantId: order.restaurantId,
      version: order.version,
      paid_via: payment_method,
      price: order.price,
      createdAt: order.createdAt,
      menu_items,
    });

    msg.ack();
  }
}
