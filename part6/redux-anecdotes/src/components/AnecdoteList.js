import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { voteFor } from '../reducers/anecdoteReducer';
import { changeNotification } from '../reducers/notificationReducer';

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes.filter(a => a.content.includes(filter)).sort((a, b) => b.votes - a.votes)
  );

  const handleVote = anecdote => {
    dispatch(voteFor(anecdote));
    dispatch(changeNotification(`You voted for ${anecdote.content}`, 5));
  };

  return (
    <div>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => handleVote(anecdote)}
        />
      ))}
    </div>
  );
};

export default AnecdoteList;
