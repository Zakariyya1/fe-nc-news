import '../styles/Title.css';
import React from 'react';
import { Link } from '@reach/router';

const Title = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="brand">
          <Link to="/">Ensy</Link>
        </h1>
      </div>
    </header>
  );
};

export default Title;
