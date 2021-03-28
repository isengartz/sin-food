import { ModalTypes } from '../../action-types';
import { closeLoginModal, showLoginModal } from '../modalActionCreator';

describe('Tests the Modal Action Creators', () => {
  it('Should open user login modal', () => {
    const expectedAction = {
      type: ModalTypes.OPEN_USER_LOGIN_MODAL,
    };
    expect(showLoginModal()).toEqual(expectedAction);
  });

  it('Should close user login modal', () => {
    const expectedAction = {
      type: ModalTypes.CLOSE_USER_LOGIN_MODAL,
    };
    expect(closeLoginModal()).toEqual(expectedAction);
  });
});
