import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { axiosUserInstance } from '../../../apis/instances/user';
import { ModalTypes, UserTypes } from '../../action-types';
import { signInUser } from '../userActionCreator';
import { Action } from '../../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(axiosUserInstance);
const store = mockStore();

describe('Tests the userActionCreator', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('should log in the user', async () => {
    // Fake response payload
    const mockedUserResponse = {
      id: '6042e13ae9ebbb001a3a3ecc',
      email: 'test@test.com',
      role: 'user',
    };

    // Fake request Body
    const reqBody = {
      email: 'test@test.com',
      password: 'testPassword',
    };

    // Mock Axios Post Request
    mock.onPost('/login', reqBody).reply(200, {
      data: {
        user: mockedUserResponse,
      },
    });

    const expectedActions = [
      {
        type: UserTypes.SIGN_IN_USER_START,
      },
      {
        type: UserTypes.SIGN_IN_USER_SUCCESS,
        payload: mockedUserResponse,
      },
      {
        type: ModalTypes.CLOSE_USER_LOGIN_MODAL, // we close the login modal too
      },
    ];

    //@ts-ignore
    await store.dispatch<Action>(signInUser(reqBody));

    expect(store.getActions()).toEqual(expectedActions);
  });
});
