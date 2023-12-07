import {
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
import { TABS } from "./utils/constants";
import SearchPage from "./pages/Search";
import MoreMenu from "./components/MoreMenu";
import Settings from "./pages/SettingsPage";

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
      <div id="app" className="h-screen flex flex-col">
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
            onClick={() => setAppData({ ...appData, tab: TABS.POST })}
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
    </>
  );
}

export default App;
