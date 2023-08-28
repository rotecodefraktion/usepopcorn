import React, { useEffect, useState } from "react";
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

export const WatchedList = ({ watched, onDelete, onSelectMovie }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}>
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

  console.log("watched: ", watched);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  console.log("avgImdbRating: ", avgImdbRating);
  console.log("avgUserRating: ", avgUserRating);
  console.log("avgRuntime: ", avgRuntime);

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
  onAddList,
  onChangeRating,
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
        onAddList={onAddList}
        onChangeRating={onChangeRating}
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
  onAddList,
  onChangeRating,
  watched,
}) => {
  const watchedIndex = watched.findIndex((wm) => wm.imdbID === movie?.imdbID);
  const [rating, setRating] = useState(
    watchedIndex >= 0 ? watched[watchedIndex].userRating : 3
  );
  console.log("watchedIndex: ", watchedIndex);

  if (movie === undefined) return <></>;

  const handleAddList = () => {
    console.log("rating: ", rating);
    if (rating === 0) setRating(() => 3);
    onAddList(movie, rating);
  };

  const handleRating = (e) => {
    onChangeRating(movie, rating);
  };

  console.log("181: rating: ", watched[watchedIndex]?.userRating);

  return (
    <section>
      <div className="rating">
        <StarRating
          maxRating={10}
          rating={watched[watchedIndex]?.userRating}
          setRating={setRating}
          fstColor="#F11A7B"
          secColor="#F11A7B"
          size={24}
          showRating={true}
          messages={["Razzie", "Bad", "OK", "Good", "Oscar"]}
          key={movie.imdbID}
        />
        {watchedIndex >= 0 && (
          <>
            <p>
              {`You already rated this movie with ${watched[watchedIndex].userRating} 🌟 `}
            </p>
            <button className="btn-add" onClick={(e) => handleRating(e)}>
              Change rating
            </button>
          </>
        )}
        {watchedIndex < 0 && (
          <button className="btn-add" onClick={handleAddList}>
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
      {Number(children) >= 8 ? <span>🌟</span> : <span>⭐️</span>}
      <span>{children}</span>
    </>
  );
};

export default Box;
