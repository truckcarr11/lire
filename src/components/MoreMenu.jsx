import { Menu } from "@mantine/core";
import { useAtom } from "jotai";
import {
  ArrowBigUpDash,
  BadgePlus,
  Flame,
  MoreHorizontal,
  Plus,
  Sword,
  TrendingUp,
} from "lucide-react";
import { appAtom, subscribedSubredditsAtom } from "../state";

function MoreMenu() {
  const [appData, setAppData] = useAtom(appAtom);
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
        <div>
          <MoreHorizontal color="#1f83fc" />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>More</Menu.Label>
        <Menu.Item leftSection={<Plus size={18} />} onClick={onSubscribe}>
          Subscribe
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default MoreMenu;
