import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { unique } from '../lib/utils';
import { ALL_BOOKS } from '../queries';

const Books = props => {
  const { loading, error, data } = useQuery(ALL_BOOKS);
  const [allGenres, setAllGenres] = useState([]);
  const [genreFilter, setGenreFilter] = useState([]);

  useEffect(() => {
    if (data) {
      const allGenres = data.allBooks.map(b => [...b.genres]);
      const allUniqueGenres = unique(allGenres.flat());
      setAllGenres(allUniqueGenres);
      setGenreFilter(allUniqueGenres);
    }
  }, [data]);

  if (!props.show) return null;
  if (loading) return <div>loading...</div>;
  if (error) return <div>{error.message}</div>;

  const filteredBooks = data.allBooks.filter(b =>
    b.genres.some(g => genreFilter.includes(g))
  );

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {/* not proud of using array index at all */}
        {allGenres.map((genre, index) => (
          <button key={index} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenreFilter(allGenres)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
