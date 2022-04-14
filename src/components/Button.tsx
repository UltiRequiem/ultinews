/** @jsx h */

import { h, tw } from "../deps.ts";

export function ShareButton() {
  const onClick = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Copied to clipboard!");
  };

  return (
    <button
      onClick={onClick}
      className={tw
        `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
    >
      Share
    </button>
  );
}
