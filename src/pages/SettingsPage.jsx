import { Button, Switch } from "@mantine/core";
import { unloadServiceWorkerAndRefresh } from "../utils/helpers";
import { useAtom } from "jotai";
import { settingsAtom } from "../state";

function Settings() {
  const [settings, setSettings] = useAtom(settingsAtom);

  async function updateApp() {
    try {
      await unloadServiceWorkerAndRefresh();
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      location.reload();
    }
  }

  function handleShowVotingArrowsChange() {
    setSettings({ ...settings, showVotingArrows: !settings.showVotingArrows });
  }

  return (
    <div className="grow max-h-[calc(100vh_-_92px)] overflow-auto">
      <div className="flex justify-center text-xl font-semibold">Settings</div>
      <div className="flex justify-center">Version 0.2.4</div>
      <div className="flex justify-center mt-4 flex-col gap-2 items-center">
        <Button onClick={updateApp}>Update</Button>
      </div>
      <div className="flex m-4 items-center justify-between">
        <p>Show Voting Arrow</p>
        <Switch
          checked={settings.showVotingArrows}
          onChange={handleShowVotingArrowsChange}
        />
      </div>
    </div>
  );
}

export default Settings;
