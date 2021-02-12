import React from 'react';

const Header: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export default Header;
