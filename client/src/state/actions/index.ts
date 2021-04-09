import { UserAction } from './userActions';
import { ModalAction } from './modalActions';
import { UtilActions } from './utilActions';
import { RestaurantAction } from './restaurantActions';

export * from './userActions';
export * from './modalActions';
export * from './utilActions';
export * from './restaurantActions';

export type Action = UserAction | ModalAction | UtilActions | RestaurantAction;
