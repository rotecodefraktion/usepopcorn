import { useEffect, useState } from "react";
import { NavBar, SearchBar, NumResults } from "./NavBar";
import {
  Box,
  MovieList,
  WatchedList,
  WatchedSummary,
  MovieDetails,
} from "./Box";
import { fetchMovies, fetchMovieDetails } from "./Helper";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [selectedMovie, setSelectedMovie] = useState();
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [rating, setRating] = useState(0);

  const handleSelectedMovie = (id) => {
    console.log("handleSelectedMovie: ", id);
    setSelectedId(() => id);
  };

  const handleAddWatched = () => {
    const runtime = parseInt(selectedMovie.Runtime);
    const newMovie = { ...selectedMovie, runtime: runtime, userRating: rating };
    setWatched(() => [...watched, newMovie]);
    setSelectedId(() => null);
  };

  const handleDeleteWatched = (id) => {
    const newWatched = watched.filter((movie) => movie.imdbID !== id);
    setWatched(() => newWatched);
    setSelectedId(() => null);
  };

  const handleSearchChange = (e) => {
    setQuery(() => e.target.value);
    //searchValue = e.target.value;
    console.log("handleSearchChange: ", query);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setMovies(() => []);
        setIsLoading(() => true);
        setError(() => null);
        const fetchedMovies = await fetchMovies(query);
        setMovies(() => fetchedMovies);
      } catch (err) {
        setError(() => err.message);
      } finally {
        setIsLoading(() => false);
      }
    }
    fetchData(); //await fetchMovies(searchValue);
  }, [query]);

  useEffect(() => {
    async function fetchData1() {
      try {
        const movie = await fetchMovieDetails(selectedId);
        setSelectedMovie(() => movie);
      } catch (err) {
        setError(() => err.message);
      }
    }
    fetchData1();
  }, [selectedId]);

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
              selectedMovie={selectedMovie}
              setSelectedId={setSelectedId}
              rating={rating}
              setRating={setRating}
              onAddList={handleAddWatched}
              watched={watched}
            />
          )}
          {!selectedId && (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} onDelete={handleDeleteWatched} />
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
