const initialState = {
  errorMessage: null,
  ackMessage: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NOTIFY_ERROR':
      return { ...state, errorMessage: action.data };
    case 'NOTIFY_ACK':
      return { ...state, ackMessage: action.data };
    default:
      return state;
  }
};

export const changeNotification = (notificationType, message, duration) => {
  return dispatch => {
    const type = notificationType === 'err' ? 'NOTIFY_ERROR' : 'NOTIFY_ACK';
    dispatch({
      type,
      data: message,
    });

    setTimeout(() => dispatch({ type, data: null }), duration * 1000);
  };
};

export default notificationReducer;
