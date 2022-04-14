/** @jsx h */

import { h, tw } from "../deps.ts";
import type { New } from "../types.ts";

export function NewItem({ item }: { item: New }) {
  return (
    <li
      key={item.objectID}
      class={tw`bg-indigo-300 p-2 m-4 hover:shadow-md rounded`}
    >
      <a class={tw`text-lg font-bold hover:text-blue-700`} href={item.url}>
        {item.title}
      </a>
      <p>{new Date(item.created_at).toLocaleString()}</p>
      <p class={tw`italic`}>
        By{" "}
        <a
          href={`https://news.ycombinator.com/user?id=${item.author}`}
          class={tw`font-bold hover:text-blue-700`}
        >
          @{item.author}
        </a>{" "}
        | <span class={tw`text-green-900`}>Points: {item.points}</span> |{" "}
        <span class={tw`text-indigo-700`}>Comments: {item.num_comments}</span>
      </p>
    </li>
  );
}
