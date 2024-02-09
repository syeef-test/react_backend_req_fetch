import React, { useState, useEffect } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryInterval, setRetryInterval] = useState(null);

  useEffect(() => {
    return () => {
      clearInterval(retryInterval);
    };
  }, [retryInterval]);

  async function fetchMoviesHandler() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://swapi.dev/api/filmss");

      if (!response.ok) {
        throw new Error("Something went wrong....Retrying");
      }

      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));

      setMovies(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      const intervalId = setInterval(fetchMoviesHandler, 5000);
      setRetryInterval(intervalId);
    }
  }

  function cancelRetryHandler() {
    clearInterval(retryInterval);
    setError(null);
    setIsLoading(false);
  }

  let content = <p>Found No Movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={fetchMoviesHandler}>Retry</button>
        <button onClick={cancelRetryHandler}>Cancel</button>
      </React.Fragment>
    );
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} disabled={isLoading}>
          Fetch Movies
        </button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
