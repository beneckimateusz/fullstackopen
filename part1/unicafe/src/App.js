import React, { useState } from "react";
import "./styles.css";

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const Statistic = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const avg = (good * 1 + neutral * 0 + bad * -1) / total;

  return (
    <div>
      <h2>statistics</h2>
      {total !== 0 ? (
        <table>
          <tbody>
            <Statistic text="good" value={good} />
            <Statistic text="neutral" value={neutral} />
            <Statistic text="bad" value={bad} />
            <Statistic text="all" value={total} />
            <Statistic text="average" value={avg.toFixed(2)} />
            <Statistic
              text="positive"
              value={`${((good / total) * 100).toFixed(2)} %`}
            />
          </tbody>
        </table>
      ) : (
        <p>no feedback given</p>
      )}
    </div>
  );
};

export default function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div className="App">
      <h2>give feedback</h2>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}
