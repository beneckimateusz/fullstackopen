import usersService from '../services/users';
const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.data;
    case 'NEW_BLOG':
      const user = state.find(u => u.username === action.data.user.username);
      user.blogs.push(action.data);
      return state.map(u =>
        u.username === action.data.user.username ? user : u
      );
    default:
      return state;
  }
};

export const initializeUsers = () => {
  return async dispatch => {
    const users = await usersService.getAll();
    dispatch({
      type: 'INIT_USERS',
      data: users,
    });
  };
};

export default usersReducer;
