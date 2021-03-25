import reducer from '../modalReducer';
import { ModalTypes } from '../../action-types';

describe('Tests the Modal Reducer', () => {
  it('should return the initial state', () => {
    // @ts-ignore
    expect(reducer(undefined, {})).toEqual({
      userLoginModal: false,
    });
  });

  it('should handle userLoginModal open', () => {
    expect(
      reducer(undefined, {
        type: ModalTypes.OPEN_USER_LOGIN_MODAL,
      }),
    ).toEqual({
      userLoginModal: true,
    });
  });

  it('should handle userLoginModal close', () => {
    expect(
      reducer(
        { userLoginModal: true },
        {
          type: ModalTypes.CLOSE_USER_LOGIN_MODAL,
        },
      ),
    ).toEqual({
      userLoginModal: false,
    });
  });
});
