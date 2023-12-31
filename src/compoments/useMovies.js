const { useEffect, useState } = require("react");

const APIKey = "510c7fd6";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const controller = new AbortController();
    const requestUrl = `http://www.omdbapi.com/?s=${query}&apikey=${APIKey}`;

    async function fetchMovies() {
      //  console.log("fetchMovies() called");
      if (query === "") {
        return;
      }
      try {
        if (query === undefined || query.length < 3) {
          throw new Error("Query must be at least 3 characters long");
        }
        setMovies(() => []);
        setIsLoading(() => true);
        setError(() => null);
        const fetchedMovies = await fetchData(requestUrl, controller);

        if (
          !fetchedMovies ||
          fetchedMovies.Error === "Movie not found!" ||
          fetchedMovies?.Search?.length === 0
        ) {
          throw new Error("No movies found");
        }

        setMovies(() => fetchedMovies.Search || []);
      } catch (err) {
        console.log(err);
        setError(() => err.message);
      } finally {
        setIsLoading(() => false);
      }
    }

    fetchMovies();
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}

export const useMoveDetails = (selectedId) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();

  useEffect(() => {
    if (!selectedId) return;

    const requestUrl = `http://www.omdbapi.com/?i=${selectedId}&apikey=${APIKey}`;

    async function fetchDetailData() {
      try {
        setError(() => null);
        setIsLoading(() => true);
        const movie = await fetchData(requestUrl);
        setSelectedMovie(() => movie);
      } catch (err) {
        setError(() => err.message);
      } finally {
        setIsLoading(() => false);
      }
    }
    fetchDetailData();
  }, [selectedId]);

  return { selectedMovie, isLoading, error };
};

async function fetchData(request, controller) {
  try {
    const response = await fetch(request, { signal: controller?.signal }).catch(
      () => {
        throw new Error("Network down, unable to fetch data");
      }
    );

    if (!response.ok) {
      throw new Error("Error during fetching data from API");
    }
    try {
      const data = await response.json();

      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      return data;
    } catch (err) {
      throw new Error("Error during parsing data");
    }
  } catch (err) {
    return err.message;
  }
}

/*export const fetchMovieDetails = async (id) => {
  if (!id) return;

  const requestUrl = `http://www.omdbapi.com/?i=${id}&apikey=${APIKey}`;

  try {
    const movie = await fetchData(requestUrl);
    return movie;
  } catch (err) {
    throw new Error(err.message);
  }
};

/* export const fetchMovies = async (query, controller) => {
  try {
    if (query === "") {
      return [];
    }

    return data.Search || [];
  } catch (err) {
    throw new Error(err.message);
  }
}; */
