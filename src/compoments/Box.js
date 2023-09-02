import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Movie from "./Movie";
import { StarRating } from "./StarRating";
import { useMoveDetails } from "./useMovies";
import { useKey } from "./useKey";

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
  if (movies.length === 0) return <></>;

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
  const deleteMovie = (e, id) => {
    e.stopPropagation();
    onDelete(id);
  };

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
              onClick={(el) => deleteMovie(el, movie.imdbID)}
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
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  );
};

export const MovieDetails = ({
  selectedId,
  setSelectedId,
  onAddList,
  onChangeRating,
  watched,
}) => {
  const { selectedMovie, isLoading, error } = useMoveDetails(selectedId);

  useKey("Escape", () => setSelectedId(() => null));

  useEffect(() => {
    if (!selectedMovie?.Title) return;
    document.title = `Movie | ${selectedMovie.Title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [selectedMovie]);

  if (error) {
    return (
      <div className="details">
        <ErrorMessage>
          <p>{error}</p>
        </ErrorMessage>
      </div>
    );
  }

  return (
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && (
        <>
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
        </>
      )}
    </div>
  );
};

const SelectedMovieHeader = ({ movie, setSelectedId }) => {
  if (movie === undefined) return <></>;

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
  const [rating, setRating] = useState(null);

  const ratingDescisionCount = useRef(0);
  const watchedIndex = useRef(
    watched.findIndex((wm) => wm.imdbID === movie?.imdbID)
  );

  const handelRatingChange = (rating) => {
    console.log("rating changed", rating);
    setRating(() => rating);
  };

  useEffect(() => {
    if (rating !== null) ratingDescisionCount.current += 1;
  }, [rating]);

  if (movie === undefined) return <></>;

  return (
    <section>
      <div className="rating">
        <StarRating
          maxRating={10}
          rating={rating || watched[watchedIndex.current]?.userRating}
          setRating={handelRatingChange}
          fstColor="#F11A7B"
          secColor="#F11A7B"
          size={24}
          showRating={true}
          messages={["Razzie", "Bad", "OK", "Good", "Oscar"]}
          key={movie.imdbID}
        />
        {watchedIndex.current >= 0 && (
          <>
            <p>
              {`You already rated this movie with ${
                watched[watchedIndex.current].userRating
              } 🌟 `}
            </p>
            <button
              className="btn-add"
              onClick={() =>
                onChangeRating(movie, rating, ratingDescisionCount.current)
              }
            >
              Change rating
            </button>
          </>
        )}
        {watchedIndex.current < 0 && (
          <button
            className="btn-add"
            onClick={() =>
              onAddList(movie, rating || 3, ratingDescisionCount.current)
            }
          >
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

const Loader = () => {
  return <p className="loader">Loading...</p>;
};

const ErrorMessage = ({ children }) => {
  return <p className="error">{children}</p>;
};

export default Box;
