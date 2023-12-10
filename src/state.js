import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TABS } from "./utils/constants";

export const appAtom = atomWithStorage("appData", {
  subreddit: "All",
  sort: "hot",
  tab: TABS.POST,
});
export const postAtom = atomWithStorage("currentPost", null);
export const subscribedSubredditsAtom = atomWithStorage(
  "subscribedSubreddits",
  ["all"]
);
export const scrollAtom = atomWithStorage("scrollPos", 0);
