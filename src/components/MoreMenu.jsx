import { Menu } from "@mantine/core";
import { useAtom } from "jotai";
import { MoreHorizontal, Plus } from "lucide-react";
import { appAtom, postAtom, subscribedSubredditsAtom } from "../state";
import { TABS } from "../utils/constants";

function MoreMenu() {
  const [appData] = useAtom(appAtom);
  const [currentPost] = useAtom(postAtom);
  const [subscribedSubreddits, setSubscribedSubreddits] = useAtom(
    subscribedSubredditsAtom
  );

  function onSubscribe() {
    if (!subscribedSubreddits.includes(appData.subreddit)) {
      setSubscribedSubreddits([...subscribedSubreddits, appData.subreddit]);
    }
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
          <Menu.Item leftSection={<Plus size={18} />} onClick={onSubscribe}>
            Subscribe
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export default MoreMenu;
