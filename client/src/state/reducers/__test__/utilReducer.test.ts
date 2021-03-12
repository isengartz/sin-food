import reducer from '../utilReducer';
import { UtilTypes } from '../../action-types';

describe('Tests the Modal Reducer', () => {
  it('should return the initial state', () => {
    // @ts-ignore
    expect(reducer(undefined, {})).toEqual({
      errors: [],
      notification: '',
    });
  });

  it('should handle global errors', () => {
    expect(
      reducer(undefined, {
        type: UtilTypes.SET_GLOBAL_ERROR_MESSAGE,
        payload: [{ message: 'Something wrong happened!' }],
      }),
    ).toEqual({
      errors: [{ message: 'Something wrong happened!' }],
      notification: '',
    });
  });

  it('should handle clear global errors', () => {
    expect(
      reducer(
        {
          errors: [{ message: 'Something wrong happened!' }],
          notification: '',
        },
        {
          type: UtilTypes.CLEAR_GLOBAL_ERROR_MESSAGE,
        },
      ),
    ).toEqual({
      errors: [],
      notification: '',
    });
  });
});
