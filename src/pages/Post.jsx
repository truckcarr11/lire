import { useAtom } from "jotai";
import { postAtom } from "../state";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";

const renderable_images = ["i.redd.it"];

function Post() {
  const [currentPost, setCurrentPost] = useAtom(postAtom);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`https://www.reddit.com${currentPost.permalink}.json`)
      .then((response) => response.json())
      .then((data) => {
        let sortedComments = data[1].data.children.sort(
          (a, b) => b.data.ups - a.data.ups
        );
        setComments(sortedComments);
      });
  }, [currentPost]);

  return (
    <div className="overflow-auto flex flex-col">
      {renderable_images.some((str) => currentPost.url.includes(str)) && (
        <img src={currentPost.url} className="w-screen h-auto" />
      )}
      <div className="px-3 mt-2 pb-4 border-b-[1px] border-[#24282f] flex-initial">
        {currentPost.title}
        {currentPost.link_flair_text && (
          <span className="rounded-xl bg-neutral-700 w-fit p-1 text-sm ml-2">
            {currentPost.link_flair_text}
          </span>
        )}
        {currentPost.selftext !== "" && (
          <div className="mt-2">{currentPost.selftext}</div>
        )}
        <div className="mt-1 text-[#70737a]">u/{currentPost.author}</div>
      </div>

      <div className="grow p-3 flex flex-col gap-2">
        {comments.map((comment) => (
          <Comment comment={comment.data} key={comment.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Post;
