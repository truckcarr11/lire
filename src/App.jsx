import {
  ArrowDown,
  ChevronLeft,
  Menu,
  Newspaper,
  Search,
  SettingsIcon,
} from "lucide-react";
import SubredditItem from "./components/SubredditItem";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtom } from "jotai";
import { appAtom, postAtom, subscribedSubredditsAtom } from "./state";
import SortMenu from "./components/SortMenu";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import { MIN_SWIPE_DISTANCE, TABS } from "./utils/constants";
import SearchPage from "./pages/Search";
import MoreMenu from "./components/MoreMenu";
import Settings from "./pages/SettingsPage";
import { useState } from "react";

function App() {
  const [appData, setAppData] = useAtom(appAtom);
  const [opened, { open, close }] = useDisclosure(false);
  const [currentPost, setCurrentPost] = useAtom(postAtom);
  const [subscribedSubreddits] = useAtom(subscribedSubredditsAtom);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;
    if (isLeftSwipe || isRightSwipe)
      if (opened && isLeftSwipe) {
        close();
      }
    if (currentPost && isRightSwipe) {
      setCurrentPost(null);
    }
  };

  function handlePostTabClick() {
    if (currentPost && appData.tab === TABS.POST) {
      setCurrentPost(null);
    } else {
      setAppData({ ...appData, tab: TABS.POST });
    }
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Drawer opened={opened} onClose={close} title="Subreddits">
        {["all", "frontpage"].concat(subscribedSubreddits).map((subreddit) => (
          <SubredditItem
            subredditName={subreddit}
            onClick={close}
            key={subreddit}
          />
        ))}
      </Drawer>
      <div id="app" className="h-screen flex flex-col">
        <div className="absolute w-full flex justify-center top-16 invisible refresh-arrow">
          <ArrowDown />
        </div>
        <div className="border-b-[1px] border-[#24282f] w-full h-11 items-center flex justify-between px-3 shrink-0">
          <div
            className="flex items-center h-full text-[#1f83fc] w-[88px]"
            onClick={(e) => {
              if (currentPost !== null && appData.tab == TABS.POST) {
                setCurrentPost(null);
              } else {
                open();
                e.stopPropagation();
              }
            }}
          >
            {currentPost !== null && appData.tab == TABS.POST ? (
              <ChevronLeft color="#1f83fc" />
            ) : (
              <Menu color="#1f83fc" />
            )}
          </div>
          <div className="text-[#e7eaef] text-lg font-semibold">
            {appData.tab === TABS.SEARCH
              ? "Search"
              : currentPost !== null && appData.tab === TABS.POST
              ? currentPost.subreddit
              : appData.subreddit.charAt(0).toUpperCase() +
                appData.subreddit.slice(1)}
          </div>
          <div className="flex items-center">
            <SortMenu />
            <MoreMenu />
          </div>
        </div>
        {currentPost === null && appData.tab === TABS.POST && <Posts />}
        {currentPost !== null && appData.tab === TABS.POST && <Post />}
        {appData.tab === TABS.SEARCH && <SearchPage />}
        {appData.tab === TABS.SETTINGS && <Settings />}
        <div className="border-t-[1px] border-[#24282f] w-full flex justify-around h-12 items-center shrink-0 grow-0">
          <div
            className="cursor-pointer w-12 h-12 flex items-center justify-center"
            onClick={handlePostTabClick}
          >
            <Newspaper
              color={appData.tab === TABS.POST ? "#1f83fc" : "#727578"}
            />
          </div>
          <div
            className="cursor-pointer w-12 h-12 flex items-center justify-center"
            onClick={() => setAppData({ ...appData, tab: TABS.SEARCH })}
          >
            <Search
              color={appData.tab === TABS.SEARCH ? "#1f83fc" : "#727578"}
            />
          </div>
          <div
            className="cursor-pointer w-12 h-12 flex items-center justify-center"
            onClick={() => setAppData({ ...appData, tab: TABS.SETTINGS })}
          >
            <SettingsIcon
              color={appData.tab === TABS.SETTINGS ? "#1f83fc" : "#727578"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
