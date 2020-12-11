import React from "react";

const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(({ id, name, exercises }) => (
        <Part key={id} name={name} exercises={exercises} />
      ))}
    </div>
  );
};

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  const total = parts
    .map((part) => part.exercises)
    .reduce((prev, cur) => prev + cur, 0);

  return (
    <p>
      <strong>total of {total} exercises</strong>
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
