import { React, useEffect, useRef } from "react";
import { useKey } from "./useKey";

export const NavBar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};

export const SearchBar = ({ query, onChangeQuery }) => {
  const inputEl = useRef(null);

  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    onChangeQuery("");
  });

  useEffect(() => {
    console.log("SearchBar mounted");
    inputEl.current.focus();
  }, []);

  return (
    <input
      className="search"
      type="text"
      name="search"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onChangeQuery(e.target.value)}
      ref={inputEl}
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
