import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { axiosUserInstance } from '../../../apis/instances/user';
import { ModalTypes, UserTypes } from '../../action-types';
import {
  getCurrentUserAddresses,
  registerUser,
  signInUser,
  signOutUser,
  addUserAddress,
} from '../userActionCreator';
import {
  mockedCreateAddressRequest,
  mockedUserGetAddressesResponse,
  mockedUserRegisterRequest,
  mockedUserRegisterResponse,
  mockedUserSignInRequest,
  mockedUserSignInResponse,
} from '../../../test/test-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(axiosUserInstance);
const store = mockStore();

describe('Tests the userActionCreator', () => {
  beforeEach(() => {
    localStorage.clear();
    store.clearActions();
  });

  it('should log in the user', async () => {
    // Mock Axios Post Request
    mock.onPost('/login', mockedUserSignInRequest).reply(200, {
      data: {
        user: mockedUserSignInResponse,
      },
    });

    const expectedActions = [
      {
        type: UserTypes.SIGN_IN_USER_START,
      },
      {
        type: UserTypes.SIGN_IN_USER_SUCCESS,
        payload: mockedUserSignInResponse,
      },
      {
        type: ModalTypes.CLOSE_USER_LOGIN_MODAL, // we close the login modal too
      },
    ];

    // @ts-ignore
    await store.dispatch(signInUser(mockedUserSignInRequest));
    expect(localStorage.getItem('user')).toBeTruthy();
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should register the user', async () => {
    // Mock Axios Post Request
    mock.onPost('/signup', mockedUserRegisterRequest).reply(200, {
      data: {
        user: mockedUserRegisterResponse,
      },
    });

    const expectedActions = [
      {
        type: UserTypes.REGISTER_USER_START,
      },
      {
        type: UserTypes.REGISTER_USER_SUCCESS,
        payload: mockedUserRegisterResponse,
      },
    ];

    // @ts-ignore
    await store.dispatch(registerUser(mockedUserRegisterRequest));
    expect(localStorage.getItem('user')).toBeTruthy();
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should signout the user', async () => {
    mock.onPost('/signout', {}).reply(200, {
      data: {
        user: null,
      },
    });

    const expectedActions = [
      {
        type: UserTypes.SIGN_OUT_USER_START,
      },
      {
        type: UserTypes.SIGN_OUT_USER_SUCCESS,
      },
    ];

    // @ts-ignore
    await store.dispatch(signOutUser());
    expect(localStorage.getItem('user')).not.toBeTruthy();
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return the user addresses', async () => {
    mock.onGet('/testUserId/address').reply(200, {
      data: {
        addresses: mockedUserGetAddressesResponse,
      },
    });

    const expectedActions = [
      {
        type: UserTypes.GET_CURRENT_USER_ADDRESSES_START,
      },
      {
        type: UserTypes.GET_CURRENT_USER_ADDRESSES_SUCCESS,
        payload: mockedUserGetAddressesResponse,
      },
    ];

    // @ts-ignore
    await store.dispatch(getCurrentUserAddresses('testUserId'));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return create a new address', async () => {
    mock.onPost('/address', mockedCreateAddressRequest).reply(200, {
      data: {
        address: mockedUserGetAddressesResponse[0],
      },
    });

    const expectedActions = [
      {
        type: UserTypes.ADD_USER_ADDRESS_START,
      },
      {
        type: UserTypes.ADD_USER_ADDRESS_SUCCESS,
        payload: mockedUserGetAddressesResponse[0],
      },
    ];

    // @ts-ignore
    await store.dispatch(addUserAddress(mockedCreateAddressRequest));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
