import React, { useState } from "react";
import Button from "./Button";
import Movie from "./Movie";
import { StarRating } from "./StarRating";

export const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <Button onClick={setIsOpen} isOpen={isOpen} />
      {isOpen && children}
    </div>
  );
};

export const MovieList = ({ movies, onSelectMovie }) => {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}>
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

export const WatchedList = ({ watched, onDelete }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={() => {}}>
          <div>
            <p>
              <Star>{movie.imdbRating}</Star>
            </p>
            <p>
              <Star>{movie.userRating}</Star>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime}</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => onDelete(movie.imdbID)}
            >
              X
            </button>
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

export const MovieDetails = ({
  selectedMovie,
  setSelectedId,
  rating,
  setRating,
  onAddList,
  watched,
}) => {
  return (
    <div className="details">
      <SelectedMovieHeader
        movie={selectedMovie}
        setSelectedId={setSelectedId}
      />
      <SelectedMovieSection
        movie={selectedMovie}
        rating={rating}
        setRating={setRating}
        onAddList={onAddList}
        watched={watched}
      />
    </div>
  );
};

const SelectedMovieHeader = ({ movie, setSelectedId }) => {
  console.log("Movie: ", movie);
  if (movie === undefined) return <></>;

  console.log("Movie: ", movie);

  return (
    <>
      <button className="btn-back" onClick={() => setSelectedId(() => null)}>
        🔙
      </button>
      <header>
        <img
          className="details"
          src={movie.Poster}
          alt={`${movie.Title} poster`}
        />
        <div className="details-overview">
          <h2>{movie.Title}</h2>
          <p>
            {movie.Released} • {movie.Runtime}
          </p>
          <p> {movie.Genre}</p>
          {movie.imdbRating && <p>⭐️ {movie.imdbRating} IMdb rating</p>}
        </div>
      </header>
    </>
  );
};

const SelectedMovieSection = ({
  movie,
  rating,
  setRating,
  onAddList,
  watched,
}) => {
  if (movie === undefined) return <></>;

  const watchedIndex = watched.findIndex((wm) => wm.imdbID === movie.imdbID);

  return (
    <section>
      <div className="rating">
        <StarRating
          maxRating={10}
          rating={rating}
          setRating={setRating}
          fstColor="#F11A7B"
          secColor="#F11A7B"
          size={24}
          showRating={true}
          messages={["Razzie", "Bad", "OK", "Good", "Oscar"]}
          key={movie.imdbID}
        />
        {watchedIndex >= 0 && (
          <p>
            {`You already rated this movie with ${watched[watchedIndex].userRating} 🌟 `}
          </p>
        )}
        {watchedIndex < 0 && (
          <button className="btn-add" onClick={onAddList}>
            + Add to list
          </button>
        )}
      </div>
      <p>
        <em>{movie.Plot}</em>
      </p>
      <p>{movie.Actors}</p>
      <p>Directed by {movie.Director}</p>
    </section>
  );
};

export const Star = ({ children }) => {
  return (
    <>
      {Number(children) >= 9 ? <span>🌟</span> : <span>⭐️</span>}
      <span>{children}</span>
    </>
  );
};
