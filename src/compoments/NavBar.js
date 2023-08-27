import { React, useState } from "react";

export const NavBar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};

export const SearchBar = ({ query, onChangeQuery }) => {
  return (
    <input
      className="search"
      type="text"
      name="search"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onChangeQuery(e)}
    />
  );
};

const Logo = () => {
  return (
    <>
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
    </>
  );
};

export const NumResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};
