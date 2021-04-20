import { UserAction } from './userActions';
import { ModalAction } from './modalActions';
import { UtilActions } from './utilActions';
import { RestaurantAction } from './restaurantActions';
import { MenuAction } from './menuActions';
import { OrderAction } from './orderActions';

export * from './userActions';
export * from './modalActions';
export * from './utilActions';
export * from './restaurantActions';
export * from './menuActions';
export * from './orderActions';

export type Action =
  | UserAction
  | ModalAction
  | UtilActions
  | RestaurantAction
  | MenuAction
  | OrderAction;
