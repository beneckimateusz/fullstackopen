const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.message;
    default:
      return state;
  }
};

export const changeNotification = (message, duration) => {
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      message,
    });

    setTimeout(
      () =>
        dispatch({
          type: 'SET_NOTIFICATION',
          message: '',
        }),
      duration * 1000
    );
  };
};

export default notificationReducer;
