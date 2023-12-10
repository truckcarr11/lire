import { Button } from "@mantine/core";
import { unloadServiceWorkerAndRefresh } from "../utils/helpers";
import { useAtom } from "jotai";
import { subscribedSubredditsAtom } from "../state";

function Settings() {
  const [subscribedSubreddits, setSubscribedSubreddits] = useAtom(
    subscribedSubredditsAtom
  );

  async function updateApp() {
    try {
      await unloadServiceWorkerAndRefresh();
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      location.reload();
    }
  }

  function fixSubreddits() {
    setSubscribedSubreddits(
      subscribedSubreddits.filter(
        (subreddit) => subreddit !== "all" && subreddit !== "frontpage"
      )
    );
  }

  return (
    <div className="grow max-h-[calc(100vh_-_92px)] overflow-auto">
      <div className="flex justify-center text-xl font-semibold">Settings</div>
      <div className="flex justify-center">Version 0.2.2</div>
      <div className="flex justify-center mt-4 flex-col gap-2 items-center">
        <Button onClick={updateApp}>Update</Button>
        <Button onClick={fixSubreddits}>Fix Subreddits</Button>
      </div>
    </div>
  );
}

export default Settings;
