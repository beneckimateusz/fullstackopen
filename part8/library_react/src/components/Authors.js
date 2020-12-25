import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import Select from 'react-select';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const Authors = props => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [setBirthyear] = useMutation(EDIT_AUTHOR);

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [born, setBorn] = useState('');

  if (!props.show) return null;
  if (loading) return <div>loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleBirthyearChange = event => {
    event.preventDefault();

    setBirthyear({ variables: { name: selectedAuthor.value, setBornTo: Number(born) } });

    setSelectedAuthor(null);
    setBorn('');
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <form onSubmit={handleBirthyearChange}>
        <div>
          name{' '}
          <Select
            defaultValue={selectedAuthor}
            onChange={setSelectedAuthor}
            options={data.allAuthors.map(a => ({
              value: a.name,
              label: a.name,
            }))}
          />
        </div>
        <div>
          born{' '}
          <input
            type="text"
            value={born}
            onChange={e => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default Authors;
