import { Menu } from "@mantine/core";
import { useAtom } from "jotai";
import {
  ArrowBigUpDash,
  BadgePlus,
  Flame,
  Sword,
  TrendingUp,
} from "lucide-react";
import { appAtom } from "../state";

function SortMenu() {
  const [appData, setAppData] = useAtom(appAtom);

  function onClick(newSort) {
    setAppData({ ...appData, sort: newSort });
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div>
          {appData.sort === "hot" && <Flame color="#1f83fc" />}
          {appData.sort === "new" && <BadgePlus color="#1f83fc" />}
          {appData.sort === "top" && <ArrowBigUpDash color="#1f83fc" />}
          {appData.sort === "controversial" && <Sword color="#1f83fc" />}
          {appData.sort === "rising" && <TrendingUp color="#1f83fc" />}
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Sort</Menu.Label>
        <Menu.Item
          leftSection={<Flame size={18} />}
          onClick={() => onClick("hot")}
        >
          Hot
        </Menu.Item>
        <Menu.Item
          leftSection={<BadgePlus size={18} />}
          onClick={() => onClick("new")}
        >
          New
        </Menu.Item>
        <Menu.Item
          leftSection={<ArrowBigUpDash size={18} />}
          onClick={() => onClick("top")}
        >
          Top
        </Menu.Item>
        <Menu.Item
          leftSection={<Sword size={18} />}
          onClick={() => onClick("controversial")}
        >
          Controversial
        </Menu.Item>
        <Menu.Item
          leftSection={<TrendingUp size={18} />}
          onClick={() => onClick("rising")}
        >
          Rising
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default SortMenu;
