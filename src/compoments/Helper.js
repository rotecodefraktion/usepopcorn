const APIKey = "510c7fd6";

async function fetchData(request) {
  try {
    const response = await fetch(request).catch(() => {
      throw new Error("Network down, unable to fetch data");
    });

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

export const fetchMovieDetails = async (id) => {
  if (!id) return;

  const requestUrl = `http://www.omdbapi.com/?i=${id}&apikey=${APIKey}`;
  console.log("requestUrl: ", requestUrl);
  try {
    const movie = await fetchData(requestUrl);
    return movie;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchMovies = async (query) => {
  try {
    if (query === "") {
      return [];
    }
    if (query === undefined || query.length < 3) {
      console.log("Query must be at least 3 characters long");
      throw new Error("Query must be at least 3 characters long");
    }

    const requestUrl = `http://www.omdbapi.com/?s=${query}&apikey=${APIKey}`;
    console.log("requestUrl: ", requestUrl);
    const data = await fetchData(requestUrl);
    if (!data.Search) {
      throw new Error("No movies found");
    }
    console.log("data.Search: ", data.Search);
    return data.Search || [];
  } catch (err) {
    throw new Error(err.message);
  }
};
