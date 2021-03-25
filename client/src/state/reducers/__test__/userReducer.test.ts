import reducer, { UserState } from '../userReducer';
import { UserTypes } from '../../action-types';
import {
  mockedUserGetAddressesResponse,
  mockedUserSignInResponse,
} from '../../../test/test-constants';
import produce from 'immer';

const initialState: UserState = {
  loading: false,
  authenticating: true,
  errors: [],
  currentUser: null,
  addresses: [],
};

describe('Tests the User Reducer', () => {
  it('should return the initial state', () => {
    // @ts-ignore
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle user sign in errors', () => {
    const storeState = reducer(initialState, {
      type: UserTypes.SIGN_IN_USER_ERROR,
      payload: [{ message: 'Something wrong happened!' }],
    });

    const newState = produce(initialState, (draftState) => {
      draftState.errors = [{ message: 'Something wrong happened!' }];
    });
    expect(storeState).toEqual(newState);
  });

  it('should handle clear user errors', () => {
    const storeState = reducer(
      { ...initialState, errors: [{ message: 'Something wrong happened!' }] },
      {
        type: UserTypes.CLEAR_USER_ERRORS,
      },
    );

    const newState = produce(initialState, (draftState) => {
      draftState.errors = [];
    });
    expect(storeState).toEqual(newState);
  });

  it('should login the user', () => {
    const storeState = reducer(initialState, {
      type: UserTypes.SIGN_IN_USER_SUCCESS,
      payload: mockedUserSignInResponse,
    });

    const newState = produce(initialState, (draftState) => {
      draftState.currentUser = mockedUserSignInResponse;
    });
    expect(storeState).toEqual(newState);
  });

  it('should register the user', () => {
    const storeState = reducer(initialState, {
      type: UserTypes.REGISTER_USER_SUCCESS,
      payload: mockedUserSignInResponse,
    });

    const newState = produce(initialState, (draftState) => {
      draftState.currentUser = mockedUserSignInResponse;
    });
    expect(storeState).toEqual(newState);
  });

  it('should signout user', () => {
    const storeState = reducer(
      {
        ...initialState,
        currentUser: mockedUserSignInResponse,
        addresses: mockedUserGetAddressesResponse,
      },
      {
        type: UserTypes.SIGN_OUT_USER_SUCCESS,
      },
    );

    const newState = produce(
      {
        ...initialState,
        currentUser: mockedUserSignInResponse,
        addresses: mockedUserGetAddressesResponse,
      },
      (draftState) => {
        // @ts-ignore
        draftState.currentUser = null;
        draftState.addresses = [];
      },
    );
    expect(storeState).toEqual(newState);
  });

  it('should fetch user address', () => {
    const storeState = reducer(initialState, {
      type: UserTypes.GET_CURRENT_USER_ADDRESSES_SUCCESS,
      payload: mockedUserGetAddressesResponse,
    });

    const newState = produce(initialState, (draftState) => {
      draftState.addresses = mockedUserGetAddressesResponse;
    });
    expect(storeState).toEqual(newState);
  });
});
