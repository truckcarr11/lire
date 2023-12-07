import {
  ChevronLeft,
  Menu,
  MoreHorizontal,
  Newspaper,
  Search,
  Settings,
} from "lucide-react";
import { useState } from "react";
import SubredditItem from "./components/SubredditItem";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtom } from "jotai";
import { appAtom, postAtom, subscribedSubredditsAtom } from "./state";
import SortMenu from "./components/SortMenu";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import { TABS } from "./utils/constants";
import SearchPage from "./pages/Search";
import MoreMenu from "./components/MoreMenu";

function App() {
  const [appData, setAppData] = useAtom(appAtom);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentPost, setCurrentPost] = useAtom(postAtom);
  const [subscribedSubreddits] = useAtom(subscribedSubredditsAtom);

  return (
    <>
      <Drawer opened={opened} onClose={close} title="Subreddits">
        {subscribedSubreddits.map((subreddit) => (
          <SubredditItem
            subredditName={subreddit}
            onClick={close}
            key={subreddit}
          />
        ))}
      </Drawer>
      <div className="h-screen flex flex-col">
        <div className="border-b-[1px] border-[#24282f] w-full h-14 items-center flex justify-between px-2 shrink-0">
          <div className="flex items-center h-full text-[#1f83fc]">
            {currentPost !== null && appData.tab == TABS.POST ? (
              <ChevronLeft
                color="#1f83fc"
                onClick={() => {
                  setCurrentPost(null);
                }}
              />
            ) : (
              <Menu
                color="#1f83fc"
                onClick={(e) => {
                  open();
                  e.stopPropagation();
                }}
              />
            )}
          </div>
          <div className="text-[#e7eaef]">
            {appData.tab === TABS.SEARCH
              ? "Search"
              : appData.subreddit.charAt(0).toUpperCase() +
                appData.subreddit.slice(1)}
          </div>
          <div className="flex items-center gap-2">
            <SortMenu />
            <MoreMenu />
          </div>
        </div>
        {currentPost === null && appData.tab === TABS.POST && <Posts />}
        {currentPost !== null && appData.tab === TABS.POST && <Post />}
        {appData.tab === TABS.SEARCH && <SearchPage />}
        <div className="border-t-[1px] border-[#24282f] w-full flex justify-around h-14 items-center shrink-0 grow-0">
          <div className="cursor-pointer">
            <Newspaper
              color={appData.tab === TABS.POST ? "#1f83fc" : "#727578"}
              onClick={() => setAppData({ ...appData, tab: TABS.POST })}
            />
          </div>
          <div className="cursor-pointer">
            <Search
              color={appData.tab === TABS.SEARCH ? "#1f83fc" : "#727578"}
              onClick={() => setAppData({ ...appData, tab: TABS.SEARCH })}
            />
          </div>
          <div className="cursor-pointer">
            <Settings
              color={appData.tab === TABS.SETTINGS ? "#1f83fc" : "#727578"}
              onClick={() => setAppData({ ...appData, tab: TABS.SETTINGS })}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
