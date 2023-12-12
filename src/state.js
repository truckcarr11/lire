import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TABS } from "./utils/constants";

export const appAtom = atomWithStorage("appData", {
  subreddit: "All",
  sort: "hot",
  tab: TABS.POST,
  searchInSubreddit: "",
});
export const postAtom = atomWithStorage("currentPost", null);
export const subscribedSubredditsAtom = atomWithStorage(
  "subscribedSubreddits",
  []
);
export const scrollAtom = atomWithStorage("scrollPos", 0);
export const settingsAtom = atomWithStorage("settings", {
  showVotingArrows: false,
});
