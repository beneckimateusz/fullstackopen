const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const res = await fetch(baseUrl);
  return await res.json();
};

const create = async (content) => {
  const newAnecdote = { content, votes: 0 };
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAnecdote),
  });

  return await res.json();
}

const update = async (modifiedAnecdote) => {
  const id = modifiedAnecdote.id;
  delete modifiedAnecdote.id;

  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(modifiedAnecdote),
  });

  return await res.json();
}

const vote = async (anecdote) => {
  const modifiedAnecdote = {...anecdote, votes: anecdote.votes + 1};
  return await update(modifiedAnecdote);
}

export default { getAll, create, vote };