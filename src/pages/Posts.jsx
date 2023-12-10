import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import PostItem from "../components/PostItem";
import { appAtom, scrollAtom, subscribedSubredditsAtom } from "../state";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@mantine/core";
import { usePullToRefresh } from "../utils/hooks";
import { ArrowDown } from "lucide-react";

function Posts() {
  const postContainerRef = useRef();
  const [appData] = useAtom(appAtom);
  const [subscribedSubreddits] = useAtom(subscribedSubredditsAtom);
  const [scrollPosition, setScrollPosition] = useAtom(scrollAtom);
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState("");
  const query = useQuery({
    queryKey: ["posts", appData.subreddit, appData.sort],
    queryFn: getPosts,
  });
  const _ = usePullToRefresh(postContainerRef, query.refetch);

  async function getPosts() {
    let subredditSearch =
      appData.subreddit === "frontpage"
        ? subscribedSubreddits
            .filter(
              (subreddit) => subreddit !== "all" && subreddit !== "frontpage"
            )
            .join("+")
        : appData.subreddit;
    const response = await fetch(
      `https://www.reddit.com/r/${subredditSearch}/${appData.sort}/.json`
    );
    const data = await response.json();
    let newPosts = data.data.children.map((child) => child.data);
    let sortedPosts = [...newPosts].sort(
      (a, b) => new Date(b.created * 1000) - new Date(a.created * 1000)
    );
    setRefreshTrigger(
      appData.sort === "new" ? sortedPosts.at(-3).name : newPosts.at(-3).name
    );
    return appData.sort === "new" ? sortedPosts : newPosts;
  }

  useEffect(() => {
    if (postContainerRef.current) {
      postContainerRef.current.scrollTop = scrollPosition;
    }
    postContainerRef.current?.addEventListener("scroll", upDateScrollPosition);

    return () => {
      postContainerRef.current?.removeEventListener(
        "scroll",
        upDateScrollPosition
      );
    };
  }, []);

  useEffect(() => {
    let subredditSearch =
      appData.subreddit === "frontpage"
        ? subscribedSubreddits
            .filter(
              (subreddit) => subreddit !== "all" && subreddit !== "frontpage"
            )
            .join("+")
        : appData.subreddit;
    fetch(`https://www.reddit.com/r/${subredditSearch}/${appData.sort}/.json`)
      .then((response) => response.json())
      .then((data) => {
        let newPosts = data.data.children.map((child) => child.data);
        let sortedPosts = [...newPosts].sort(
          (a, b) => new Date(b.created * 1000) - new Date(a.created * 1000)
        );
        setRefreshTrigger(
          appData.sort === "new"
            ? sortedPosts.at(-3).name
            : newPosts.at(-3).name
        );
        setPosts(appData.sort === "new" ? sortedPosts : newPosts);
      });
  }, [appData.subreddit, appData.sort]);

  function refresh() {
    if (posts.length !== 0) {
      let after = posts.at(-1).name;
      fetch(
        `https://www.reddit.com/r/${appData.subreddit}/${appData.sort}/.json?after=${after}`
      )
        .then((response) => response.json())
        .then((data) => {
          let newPosts = data.data.children.map((child) => child.data);
          let combinedPosts = posts.concat(newPosts);
          let sortedPosts = combinedPosts.sort(
            (a, b) => new Date(b.created * 1000) - new Date(a.created * 1000)
          );
          setRefreshTrigger(
            appData.sort === "new"
              ? sortedPosts.at(-3).name
              : combinedPosts.at(-3).name
          );
          setPosts(appData.sort === "new" ? sortedPosts : combinedPosts);
        });
    }
  }

  function upDateScrollPosition() {
    setScrollPosition(postContainerRef.current?.scrollTop ?? scrollPosition);
  }

  if (query.isLoading) {
    return (
      <div className="grow max-h-[calc(100vh_-_92px)] overflow-auto flex justify-center">
        <Loader type="dots" />
      </div>
    );
  }

  return (
    <>
      <div className="absolute w-full flex justify-center top-16 invisible refresh-arrow">
        <ArrowDown />
      </div>
      <div
        ref={postContainerRef}
        className="grow max-h-[calc(100vh_-_92px)] overflow-auto"
      >
        {query.data.map((post) => (
          <PostItem
            post={post}
            key={post.name}
            onVisible={post.name === refreshTrigger ? refresh : null}
          />
        ))}
      </div>
    </>
  );
}

export default Posts;
