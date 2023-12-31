import {
  ArrowDown,
  ArrowUp,
  Clock,
  GanttChart,
  MessageCircle,
  Pin,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useIsVisible } from "../utils/hooks";
import { useRef, useState } from "react";
import { useAtom } from "jotai";
import { appAtom, postAtom, seenPostsAtom, settingsAtom } from "../state";
import { TABS } from "../utils/constants";
dayjs.extend(relativeTime);

function PostItem(props) {
  const [settings] = useAtom(settingsAtom);
  const [appData, setAppData] = useAtom(appAtom);
  const [currentPost, setCurrentPost] = useAtom(postAtom);
  const [seenPostsData, setSeenPostsData] = useAtom(seenPostsAtom);
  const [causedRefresh, setCausedRefresh] = useState(false);
  const ref = useRef();
  const isVisible = useIsVisible(ref);

  if (isVisible && props.onVisible !== null && !causedRefresh) {
    props.onVisible();
    setCausedRefresh(true);
  }

  function onClick() {
    if (currentPost?.name !== props.post.name) {
      let newSeenPostsNames = seenPostsData.postNames;
      newSeenPostsNames.push(props.post.name);
      setSeenPostsData({ ...seenPostsData, postNames: newSeenPostsNames });
      setCurrentPost(props.post);
    }
    setAppData({ ...appData, tab: TABS.POST });
  }

  return (
    <div
      className="flex justify-between border-b-[1px] border-[#24282f] p-2 cursor-pointer px-3 gap-2"
      ref={ref}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {settings.showVotingArrows && (
          <div className="flex flex-col">
            <ArrowUp color="#4f5256" />
            <ArrowDown color="#4f5256" />
          </div>
        )}
        <div>
          <div
            className={`text-[${
              seenPostsData.postNames.includes(props.post.name)
                ? "#171718"
                : "#e7eaef"
            }] flex gap-2 items-center`}
          >
            {props.post.stickied && (
              <Pin size={20} color="green" className="shrink-0" />
            )}
            {props.post.title}
          </div>
          <div className="flex items-center gap-x-3 text-[#70737a] flex-wrap">
            <div>{props.post.subreddit}</div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap 1">
                <ArrowUp size={14} />
                <div>{props.post.ups}</div>
              </div>
              <div className="flex items-center gap 1">
                <MessageCircle size={14} />
                <div>{props.post.num_comments}</div>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <div>
                  {dayjs(new Date(props.post.created * 1000)).fromNow()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="rounded shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          window.open(props.post.url);
        }}
      >
        {props.post.thumbnail.includes("thumbs") ? (
          <img
            className={`w-14 h-14 rounded ${
              props.post.over_18 ? "blur-sm" : ""
            }`}
            src={props.post.thumbnail}
            alt="alt"
          />
        ) : (
          <GanttChart
            size={56}
            className="bg-[#212428] rounded"
            color="#505458"
          />
        )}
      </div>
    </div>
  );
}

export default PostItem;
