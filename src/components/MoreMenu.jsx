import { Menu } from "@mantine/core";
import { useAtom } from "jotai";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { appAtom, postAtom, subscribedSubredditsAtom } from "../state";
import { TABS } from "../utils/constants";

function MoreMenu() {
  const [appData, setAppData] = useAtom(appAtom);
  const [currentPost] = useAtom(postAtom);
  const [subscribedSubreddits, setSubscribedSubreddits] = useAtom(
    subscribedSubredditsAtom
  );

  function onSubscribe() {
    if (!subscribedSubreddits.includes(appData.subreddit)) {
      setSubscribedSubreddits([...subscribedSubreddits, appData.subreddit]);
    }
  }

  function onSearch() {
    setAppData({
      ...appData,
      searchInSubreddit: appData.subreddit,
      tab: TABS.SEARCH,
    });
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div className="cursor-pointer w-11 h-11 flex items-center justify-center">
          <MoreHorizontal color="#1f83fc" />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>More</Menu.Label>
        {currentPost === null && appData.tab === TABS.POST && (
          <>
            <Menu.Item leftSection={<Plus size={18} />} onClick={onSubscribe}>
              Subscribe
            </Menu.Item>
            <Menu.Item leftSection={<Search size={18} />} onClick={onSearch}>
              Search
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export default MoreMenu;
