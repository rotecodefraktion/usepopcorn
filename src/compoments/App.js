import { useEffect, useState } from "react";
import { NavBar, SearchBar, NumResults } from "./NavBar";
import {
  Box,
  MovieList,
  WatchedList,
  WatchedSummary,
  MovieDetails,
} from "./Box";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState();

  const [watched, setWatched] = useLocalStorageState([], "watched");
  const { movies, isLoading, error } = useMovies(query);

  function handleSelectedMovie(id) {
    setSelectedId(() => id);
  }

  function handleAddWatched(movie, rating, decisionCount) {
    const runtime = parseInt(movie.Runtime);
    const newMovie = {
      ...movie,
      runtime: runtime,
      userRating: rating,
      ratingDecisionCount: decisionCount,
    };
    setWatched(() => [...watched, newMovie]);
    setSelectedId(() => null);
  }

  function handleChangeRatingWatched(movie, rating, decisionCount) {
    const changedMovies = watched.map((movie) => {
      if (movie.imdbID === selectedId) {
        return {
          ...movie,
          userRating: rating,
          ratingDecisionCount: decisionCount,
        };
      } else {
        return movie;
      }
    });

    setWatched(() => changedMovies);
    setSelectedId(() => null);
  }

  function handleDeleteWatched(id) {
    const newWatched = watched.filter((movie) => movie.imdbID !== id);
    setWatched(() => newWatched);
    setSelectedId(() => null);
  }

  function handleSearchChange(value) {
    setQuery(() => value);
  }

  return (
    <>
      <NavBar>
        <SearchBar query={query} onChangeQuery={handleSearchChange} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage>❌ {error}</ErrorMessage>}
        </Box>

        <Box>
          {selectedId && (
            <MovieDetails
              //selectedMovie={selectedMovie}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onAddList={handleAddWatched}
              onChangeRating={handleChangeRatingWatched}
              watched={watched}
            />
          )}
          {!selectedId && (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDelete={handleDeleteWatched}
                onSelectMovie={handleSelectedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const Loader = () => {
  return <p className="loader">Loading...</p>;
};

const ErrorMessage = ({ children }) => {
  return <p className="error">{children}</p>;
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};
