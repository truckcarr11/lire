import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import PostItem from "../components/PostItem";
import { appAtom } from "../state";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@mantine/core";

function Posts() {
  const [appData] = useAtom(appAtom);
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState("");

  const query = useQuery({
    queryKey: ["posts", appData.subreddit, appData.sort],
    queryFn: getPosts,
  });

  async function getPosts() {
    const response = await fetch(
      `https://www.reddit.com/r/${appData.subreddit}/${appData.sort}/.json`
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
    fetch(`https://www.reddit.com/r/${appData.subreddit}/${appData.sort}/.json`)
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

  if (query.isLoading) {
    return (
      <div className="grow max-h-[calc(100vh_-_92px)] overflow-auto flex justify-center">
        <Loader type="dots" />
      </div>
    );
  }

  return (
    <>
      <div className="grow max-h-[calc(100vh_-_92px)] overflow-auto">
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
