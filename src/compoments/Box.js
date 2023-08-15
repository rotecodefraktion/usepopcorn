import React, { useState } from "react";
import Button from "./Button";
import Movie from "./Movie";

const Box = ({ movies, avgImdbRating, avgUserRating, avgRuntime }) => {
  const [isOpen, setIsOpen] = useState(true);
  console.log(typeof avgImdbRating);
  return (
    <div className="box">
      <Button onClick={setIsOpen} isOpen={isOpen} />
      {isOpen && (
        <>
          {avgImdbRating !== undefined && (
            <WatchedSummary
              watched={movies}
              avgImdbRating={avgImdbRating}
              avgUserRating={avgUserRating}
              avgRuntime={avgRuntime}
            />
          )}
          <ul className="list">
            {movies?.map((movie) => (
              <Movie movie={movie} key={movie.imdbID}>
                {movie.runtime === undefined ? (
                  <MovieListChildren movie={movie} />
                ) : (
                  <WatchedListChildren movie={movie} />
                )}
              </Movie>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const MovieListChildren = ({ movie }) => {
  return (
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  );
};

const WatchedListChildren = ({ movie }) => {
  return (
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
    </div>
  );
};

function WatchedSummary({ watched, avgImdbRating, avgUserRating, avgRuntime }) {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

export default Box;
