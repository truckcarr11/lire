import { TextInput } from "@mantine/core";
import { useAtom } from "jotai";
import debounce from "lodash.debounce";
import { useState } from "react";
import { appAtom } from "../state";
import { TABS } from "../utils/constants";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [appData, setAppData] = useAtom(appAtom);

  function onChange(e) {
    fetch(`https://www.reddit.com/search/.json?q=${e.target.value}&type=sr`)
      .then((response) => response.json())
      .then((data) =>
        setSearchResults(data.data.children.map((child) => child.data))
      );
  }

  const debouncedOnChange = debounce(onChange, 500);

  function onClick(newSubreddit) {
    setAppData({ ...appData, subreddit: newSubreddit, tab: TABS.POST });
  }

  return (
    <div className="grow p-2 max-h-[calc(100vh_-_96px)] overflow-auto">
      <TextInput placeholder="Enter a subreddit" onChange={debouncedOnChange} />
      <div className="flex flex-col gap-3 mt-4">
        {searchResults.map((result) => (
          <div
            className="flex gap-2"
            key={result.name}
            onClick={() => onClick(result.display_name)}
          >
            <img
              src={result.icon_img}
              width={24}
              height={24}
              className="rounded-full"
            ></img>
            <div>{result.display_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
