/** @jsx h */
import { h, render, useState, useEffect, JSX, tw } from "./deps.ts";
import { Footer, ItemList } from "./components/mod.ts";

import type { New, AngoliaResponse } from "./types.ts";

function App() {
  const [data, setData] = useState<New[]>([]);
  const [query, setQuery] = useState("deno");
  const [search, setSearch] = useState("deno");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      const API_URL = `https://hn.algolia.com/api/v1/search?query=${search}`;

      try {
        const result = await fetch(API_URL);

        if (!result.ok) {
          throw new Error(result.statusText);
        }

        const data = (await result.json()) as AngoliaResponse;
        const parsedData = data.hits.filter((item) => item.url);

        setData(parsedData);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [search]);

  const handleInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const onSubmit = (event: JSX.TargetedEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(query);
  };

  return (
    <main class={tw`min-h-screen bg-indigo-300 flex flex-col items-center`}>
      <h1 class={tw`md:text-7xl text-5xl m-5 underline`}>UltiNews</h1>
      <form onSubmit={onSubmit} class={tw`flex gap-3`}>
        <label>
          <input
            class={tw`p-2 rounded w-full`}
            type="text"
            value={query}
            onInput={handleInput}
          />
        </label>
        <button
          class={tw`focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
          type="submit"
          onClick={() => setSearch(query)}
        >
          Go
        </button>
      </form>
      {isError && <div>Something went wrong ...</div>}

      {isLoading ? <div>Loading...</div> : <ItemList items={data} />}
      <Footer />
    </main>
  );
}

render(<App />, document.getElementById("root")!);
