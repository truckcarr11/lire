import { useAtom } from "jotai";
import { postAtom } from "../state";
import Comment from "../components/Comment";
import { Image, Loader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "@mantine/carousel";

const renderable_images = ["i.redd.it"];

function Post() {
  const [currentPost] = useAtom(postAtom);
  const query = useQuery({
    queryKey: ["postComments", currentPost.permalink],
    queryFn: getPostComments,
  });
  const carouselImages = Object.values(currentPost.media_metadata).map(
    (media) => `https://i.redd.it/${media.id}.${media.m.split("/").at(-1)}`
  );

  async function getPostComments() {
    const response = await fetch(
      `https://www.reddit.com${currentPost.permalink}.json`
    );
    const data = await response.json();
    return data[1].data.children.sort((a, b) => b.data.ups - a.data.ups);
  }

  return (
    <div className="grow overflow-auto flex flex-col">
      {renderable_images.some((str) => currentPost.url.includes(str)) &&
        !currentPost.is_gallery && (
          <img src={currentPost.url} className="w-screen h-auto" />
        )}
      {currentPost.is_gallery && (
        <Carousel withIndicators>
          {carouselImages.map((url) => (
            <Carousel.Slide key={url}>
              <Image src={url} />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
      <div className="px-3 mt-2 pb-4 border-b-[1px] border-[#24282f] flex-initial">
        <span className="text-white">{currentPost.title}</span>
        {currentPost.link_flair_text && (
          <span className="rounded-xl bg-neutral-700 w-fit p-1 text-sm ml-2">
            {currentPost.link_flair_text}
          </span>
        )}
        {currentPost.selftext !== "" && (
          <div className="mt-2">{currentPost.selftext}</div>
        )}
        <div className="text-[#70737a]">
          <span className="">in </span>
          <span className="font-semibold">{currentPost.subreddit} </span>
          <span>by </span>
          <span className="font-semibold">u/{currentPost.author}</span>
        </div>
      </div>
      <div className="grow p-3 flex flex-col gap-2">
        {query.isLoading ? (
          <div className="flex justify-center">
            <Loader type="dots" />
          </div>
        ) : (
          <>
            {query.data.map((comment) => (
              <Comment comment={comment.data} key={comment.data.name} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Post;
