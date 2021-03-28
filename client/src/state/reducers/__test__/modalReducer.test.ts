import reducer from '../modalReducer';
import { ModalTypes } from '../../action-types';

const initialState = {
  userLoginModal: false,
  userAddressModal: false,
};

describe('Tests the Modal Reducer', () => {
  it('should return the initial state', () => {
    // @ts-ignore
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle userLoginModal open', () => {
    expect(
      reducer(undefined, {
        type: ModalTypes.OPEN_USER_LOGIN_MODAL,
      }),
    ).toEqual({
      ...initialState,
      userLoginModal: true,
    });
  });

  it('should handle userLoginModal close', () => {
    expect(
      reducer(
        { ...initialState, userLoginModal: true },
        {
          type: ModalTypes.CLOSE_USER_LOGIN_MODAL,
        },
      ),
    ).toEqual({
      ...initialState,
      userLoginModal: false,
    });
  });
});
