import React, { useState } from "react";
import Button from "./Button";
import Movie from "./Movie";
export const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <Button onClick={setIsOpen} isOpen={isOpen} />
      {isOpen && children}
    </div>
  );
};

export const MovieList = ({ movies }) => {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID}>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </Movie>
      ))}
    </ul>
  );
};

export const WatchedList = ({ watched }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Movie movie={movie} key={movie.imdbID}>
          <div>
            <p>
              <Star>{movie.imdbRating}</Star>
            </p>
            <p>
              <Star>{movie.userRating}</Star>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
        </Movie>
      ))}
    </ul>
  );
};

export const WatchedSummary = ({ watched }) => {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <Star>{avgImdbRating.toFixed(2)}</Star>
        </p>
        <p>
          <Star>{avgUserRating.toFixed(2)}</Star>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

export const Star = ({ children }) => {
  return (
    <>
      {Number(children) >= 9 ? <div>🌟</div> : <div>⭐️</div>}
      <span>{children}</span>
    </>
  );
};
