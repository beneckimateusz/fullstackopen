import React, { useState } from "react";
import "./styles.css";

const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const range = (start, end) =>
  Array.from({ length: end - start }, (_, i) => start + i);

const randomElement = (arr) => arr[getRandomInteger(0, arr.length)];

const Anecdote = ({ text, votes }) => (
  <>
    <p>{text}</p>
    <p>has {votes} votes</p>
  </>
);

export default function App({ anecdotes }) {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  const mostVotedAnectodeIndex = points.reduce(
    (iMax, curVal, curIndex, arr) => (curVal > arr[iMax] ? curIndex : iMax),
    0
  );

  const handleClickNextAnectode = () => {
    setSelected((prevIndex) => {
      const otherIndices = range(0, anecdotes.length).filter(
        (index) => index !== prevIndex
      );

      return randomElement(otherIndices);
    });
  };

  const handleClickVote = () => {
    const pointsCopy = [...points];
    pointsCopy[selected]++;
    setPoints(pointsCopy);
  };

  return (
    <div>
      <h2>Anectode of the day</h2>
      <Anecdote text={anecdotes[selected]} votes={points[selected]} />
      <button onClick={handleClickVote}>vote</button>
      <button onClick={handleClickNextAnectode}>next anectode</button>
      <h2>Anectode with most votes</h2>
      <Anecdote
        text={anecdotes[mostVotedAnectodeIndex]}
        votes={points[mostVotedAnectodeIndex]}
      />
    </div>
  );
}
