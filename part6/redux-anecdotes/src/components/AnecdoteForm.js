import React from 'react';
import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { changeNotification } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = e => {
    e.preventDefault();

    const content = e.target.content.value;
    e.target.content.value = '';
    dispatch(createAnecdote(content));
    dispatch(changeNotification(`You created ${content}`));
    setTimeout(() => dispatch(changeNotification('')), 5000);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="content" type="text" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
