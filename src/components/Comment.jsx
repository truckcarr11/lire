import { ArrowUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { decodeEntities } from "../utils/helpers";
import dayjs from "dayjs";

const comment_color_rainbow = [
  "",
  "border-cyan-700",
  "border-sky-700",
  "border-blue-700",
  "border-indigo-700",
  "border-violet-700",
  "border-purple-700",
  "border-fuchsia-700",
  "border-pink-700",
  "border-rose-700",
];

function Comment(props) {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const borderColor = comment_color_rainbow[props.depth ? props.depth : 0];

  return (
    <div className={`${borderColor ? "border-l-2 pl-4 " + borderColor : ""}`}>
      <div className="flex justify-between">
        <div className="text-[#1f83fc]/80 flex items-center gap-1">
          <div className="flex items-center">
            {props.comment.author}
            {props.comment.author_flair_richtext &&
              props.comment.author_flair_richtext.length > 0 && (
                <span className="rounded-lg bg-neutral-700 p-1 text-sm ml-1 w-6 h-4 flex items-center">
                  <img
                    src={props.comment.author_flair_richtext[0].u}
                    className="h-4"
                  />
                </span>
              )}
          </div>
          <div className="text-[#c9c9c9]">•</div>
          <div className="text-[#c9c9c9]">
            {dayjs(new Date(props.comment.created * 1000)).fromNow()}
          </div>
        </div>
        <div className="flex items-center">
          <ArrowUp size={16} />
          {props.comment.ups}
        </div>
      </div>
      <Markdown
        children={decodeEntities(props.comment.body)}
        className="break-words"
      />
      {props.comment.replies?.data?.children?.length !== undefined && (
        <>
          {repliesExpanded ? (
            <div className="grow flex flex-col">
              {props.comment.replies?.data?.children.map((comment) => (
                <Comment
                  comment={comment.data}
                  key={comment.data.name}
                  depth={props.depth > 0 ? props.depth + 1 : 1}
                />
              ))}
            </div>
          ) : (
            <div
              className="p-1 border-l-2 flex justify-between mb-2"
              onClick={() => setRepliesExpanded(true)}
            >
              <div>{props.comment.replies?.data?.children.length} more</div>
              <div>
                <ChevronDown />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Comment;
