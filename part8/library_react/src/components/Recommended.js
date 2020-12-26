import { useQuery } from '@apollo/client';
import React from 'react';
import { RECOMMENDED } from '../queries';

const Recommended = ({ show }) => {
  const { loading, error, data } = useQuery(RECOMMENDED);

  if (!show) return null;
  if (loading) return <div>loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>patterns</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.recommended.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
