import anecdoteService from '../services/anecdote';

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data;
    case 'NEW_ANECDOTE':
      return [...state, action.data];
    case 'VOTE':
      return state.map(a =>
        a.id === action.data.id ? { ...a, votes: a.votes + 1 } : a
      );
    default:
      return state;
  }
};

export const voteFor = anecdote => {
  return async dispatch => {
    await anecdoteService.vote(anecdote);
    dispatch({
      type: 'VOTE',
      data: { id: anecdote.id },
    });
  };
};

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content);
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    });
  };
};

export const initializeAnecdotes = anecdotes => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    });
  };
};

export default reducer;
