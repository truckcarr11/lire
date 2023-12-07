import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TABS } from "./utils/constants";

export const appAtom = atom({ subreddit: "All", sort: "hot", tab: TABS.POST });
export const postAtom = atom(null);
export const subscribedSubredditsAtom = atomWithStorage(
  "subscribedSubreddits",
  []
);
