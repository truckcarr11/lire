import { useAtom } from "jotai";
import { appAtom } from "../state";
import { TABS } from "../utils/constants";

function SubredditItem(props) {
  const [appData, setAppData] = useAtom(appAtom);

  function onClick() {
    props.onClick();
    setAppData({ ...appData, subreddit: props.subredditName, tab: TABS.POST });
  }

  return (
    <div
      className="flex justify-between border-b-[1px] border-[#24282f] p-2 cursor-pointer"
      onClick={onClick}
    >
      {props.subredditName}
    </div>
  );
}

export default SubredditItem;
