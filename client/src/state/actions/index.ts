import { UserAction } from './userActions';
import { ModalAction } from './modalActions';
import { UtilActions } from './utilActions';
import { RestaurantAction } from './restaurantActions';
import { MenuAction } from './menuActions';

export * from './userActions';
export * from './modalActions';
export * from './utilActions';
export * from './restaurantActions';
export * from './menuActions';

export type Action =
  | UserAction
  | ModalAction
  | UtilActions
  | RestaurantAction
  | MenuAction;
