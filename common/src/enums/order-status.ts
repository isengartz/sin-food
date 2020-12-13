export enum OrderStatus {
  // When the order has been created but not paid
  Created = 'created',
  // When the order has been paid
  Completed = 'completed',
  // When the order has not been paid after a given time
  Canceled = 'canceled',
  // When the order has been paid, but refunded after.
  // Not sure if I will use this but better safe than sorry xD
  Refunded = 'refunded',
}
