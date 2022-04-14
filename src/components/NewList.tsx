/** @jsx h */

import { h, tw } from "../deps.ts";
import type { New } from "../types.ts";

export function ItemList({ items }: { items: New[] }) {
  return (
    <ul class={tw`bg-indigo-400 rounded-lg p-4 m-3 min-w-[80%]`}>
      {items.map((item) => <NewItem item={item} />)}
    </ul>
  );
}
