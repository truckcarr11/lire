import {
  Menu,
  MoreHorizontal,
  Newspaper,
  Search,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtom } from "jotai";
import SubredditItem from "../components/SubredditItem";
import SortMenu from "../components/SortMenu";
import PostItem from "../components/PostItem";
import { appAtom } from "../state";

function Posts() {
  const [appData] = useAtom(appAtom);
  const [posts, setPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState("");

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

  return (
    <>
      <div className="grow max-h-[calc(100vh_-_112px)] overflow-auto">
        {posts.map((post) => (
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
