import blogService from '../services/blogs';
import loginService from '../services/login';
import { changeNotification } from './notificationReducer';

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

export const setUserFromLS = user => {
  return dispatch => {
    const userJSON = localStorage.getItem('loggedInUser');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      blogService.setToken(user.token);

      dispatch({
        type: 'SET_USER',
        data: user,
      });
    }
  };
};

export const login = credentials => {
  return async dispatch => {
    const user = await loginService.login(credentials);

    localStorage.setItem('loggedInUser', JSON.stringify(user));
    blogService.setToken(user.token);

    dispatch({
      type: 'SET_USER',
      data: user,
    });

    dispatch(changeNotification('ack', 'successfully logged in!', 5));
  };
};

export const logout = () => {
  return dispatch => {
    localStorage.removeItem('loggedInUser');
    blogService.setToken(null);

    dispatch({
      type: 'LOGOUT',
    });

    dispatch(changeNotification('ack', 'successfully logged out!', 5));
  };
};

export default userReducer;
