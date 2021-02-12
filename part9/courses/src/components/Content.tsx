import React from 'react';
import { CoursePart } from '../types';
import Part from './Part';

const Content: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => {
  return (
    <div>
      {courseParts.map((cp, index) => (
        <Part key={index} coursePart={cp} />
      ))}
    </div>
  );
};

export default Content;
