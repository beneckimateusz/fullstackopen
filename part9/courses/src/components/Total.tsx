import React from 'react';

const Total: React.FC<{ total: number }> = ({ total }) => {
  return (
    <div>
      <p>Number of exercises {total}</p>
    </div>
  );
};

export default Total;
