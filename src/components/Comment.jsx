import { ArrowUp, ChevronDown } from "lucide-react";
import { useState } from "react";

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
  console.log(props.depth);
  return (
    <div className={`${borderColor ? "border-l-2 pl-4 " + borderColor : ""}`}>
      <div className="flex justify-between">
        <div className="text-[#1f83fc]/80">{props.comment.author}</div>
        <div className="flex items-center">
          <ArrowUp size={16} />
          {props.comment.ups}
        </div>
      </div>
      <div>{props.comment.body}</div>
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
              className="p-1 border-l-2 flex justify-between"
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
