export enum OrderTypes {
  ADD_ITEM_TO_CART = 'order/add_item_to_cart',
  REMOVE_ITEM_FROM_CART = 'order/remove_item_from_cart',
  INITIALIZE_CART_DATA = 'order/initialize_cart_data',
  CLEAR_CART_DATA = 'order/clear_cart_data',
  UPDATE_CART_ITEM = 'order/update_cart_item',
  UPDATE_CART_ITEM_ERROR = 'order/update_cart_item_error',
  SET_ORDER_ERRORS = 'order/set_order_errors',
  CLEAR_ORDER_ERRORS = 'order/clear_order_errors',
  UPDATE_ORDER_PAYMENT_METHOD = 'order/update_order_payment_method',
}
