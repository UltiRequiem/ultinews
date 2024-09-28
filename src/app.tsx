/** @jsx h */
import {
  h,
  JSX,
  render,
  setIntervalX,
  tw,
  useEffect,
  useState,
} from "./deps.ts";
import { Footer, ItemList, ShareButton } from "./components/mod.ts";

import type { AngoliaResponse, New } from "./types.ts";

function App() {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("q") ?? "deno";

  const [news, setNews] = useState<New[]>([]);
  const [query, setQuery] = useState(searchQuery);
  const [search, setSearch] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      const API_URL = `https://hn.algolia.com/api/v1/search?query=${search}`;

      let interval: number;

      const originalResponse = await fetch(API_URL);

      const { nbPages } = (await originalResponse.json()) as AngoliaResponse;

      try {
        let page = 0;

        interval = setIntervalX(
          async () => {
            const API_URL_PAGE = `${API_URL}&page=${page}`;
            const response = await fetch(API_URL_PAGE);

            if (!response.ok) {
              throw new Error(response.statusText);
            }

            page++;

            const result = (await response.json()) as AngoliaResponse;

            if (result.hits.length === 0) {
              return clearInterval(interval);
            }

            const parsedData = result.hits.filter((item) => item.url);

            setNews((prevData) => [...prevData, ...parsedData]);
          },
          1000,
          nbPages,
        );
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);

      return () => clearInterval(interval);
    };

    fetchData();
  }, [search]);

  const handleInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    event.preventDefault();

    setQuery(event.currentTarget.value);

    document.title = `UltiNews | ${query}`;

    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set("q", query);

    window.history.replaceState(
      {},
      document.title,
      `${window.location.pathname}/ultinews/?${urlParams.toString()}`,
    );
  };

  const onSubmit = (event: JSX.TargetedEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(query);
    window.location.replace(`/?q=${query}`);
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
          class={tw
            `focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
          type="submit"
          onClick={() =>
            setSearch(query)}
        >
          Go
        </button>
      </form>
      {isError && <div>Something went wrong ...</div>}

      {isLoading ? <div>Loading...</div> : <ItemList items={news} />}
      <ShareButton />
      <Footer />
    </main>
  );
}

render(<App />, document.getElementById("root")!);
