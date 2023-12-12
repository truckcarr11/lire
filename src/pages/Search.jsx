import { CloseButton, Pill, TextInput } from "@mantine/core";
import { useAtom } from "jotai";
import debounce from "lodash.debounce";
import { useState } from "react";
import { appAtom, postAtom } from "../state";
import { TABS } from "../utils/constants";
import PostItem from "../components/PostItem";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [appData, setAppData] = useAtom(appAtom);
  const [, setCurrentPost] = useAtom(postAtom);

  function onChange(e) {
    const searchUrl = appData.searchInSubreddit
      ? `https://www.reddit.com/r/${appData.searchInSubreddit}/search.json?q=${e.target.value}&restrict_sr=on&include_over_18=on&sort=relevance&t=all`
      : `https://www.reddit.com/search/.json?q=${e.target.value}&type=sr&restrict_sr=on&include_over_18=on&sort=relevance&t=all`;
    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) =>
        setSearchResults(data.data.children.map((child) => child.data))
      );
  }

  const debouncedOnChange = debounce(onChange, 500);

  function onClick(newSubreddit) {
    setAppData({ ...appData, subreddit: newSubreddit, tab: TABS.POST });
    setCurrentPost(null);
  }

  function clearSearchInSubreddit() {
    setAppData({ ...appData, searchInSubreddit: "" });
  }

  return (
    <div className="grow p-2 max-h-[calc(100vh_-_92px)] overflow-auto">
      <TextInput
        size="md"
        placeholder={
          appData.searchInSubreddit !== ""
            ? `Search in ${appData.searchInSubreddit}`
            : "Search Reddit"
        }
        onChange={debouncedOnChange}
        leftSection={
          appData.searchInSubreddit ? (
            <Pill className="">{appData.searchInSubreddit}</Pill>
          ) : null
        }
        leftSectionWidth={appData.searchInSubreddit.length * 6 + 20}
        rightSection={
          appData.searchInSubreddit ? (
            <CloseButton onClick={clearSearchInSubreddit} />
          ) : null
        }
      />
      <div className="flex flex-col gap-3 mt-4">
        {searchResults.map((result) => (
          <>
            {appData.searchInSubreddit ? (
              <PostItem post={result} onVisible={null} key={result.name}>
                Test
              </PostItem>
            ) : (
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
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default Search;
