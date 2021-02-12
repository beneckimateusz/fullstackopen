import React from 'react';
import { CoursePart } from '../types';
import { assertNever } from '../utils';

const Part: React.FC<{ coursePart: CoursePart }> = ({ coursePart }) => {
  const displaySpecificAttributes = () => {
    switch (coursePart.name) {
      case 'Fundamentals':
        return <p>description: {coursePart.description}</p>;
      case 'Using props to pass data':
        return <p>group project count: {coursePart.groupProjectCount}</p>;
      case 'Deeper type usage':
        return (
          <>
            <p>description: {coursePart.description}</p>
            <p>
              <a href={coursePart.exerciseSubmissionLink}>submission link</a>
            </p>
          </>
        );
      case 'Random course':
        return (
          <>
            <p>description: {coursePart.description}</p>
            <p>difficulty: {coursePart.difficulty}</p>
          </>
        );
      default:
        return assertNever(coursePart);
    }
  };

  return (
    <div>
      <strong>{coursePart.name}</strong> {coursePart.exerciseCount}
      {displaySpecificAttributes()}
    </div>
  );
};

export default Part;
