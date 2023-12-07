import { Button } from "@mantine/core";
import { unloadServiceWorkerAndRefresh } from "../utils/helpers";

function Settings() {
  async function updateApp() {
    try {
      await unloadServiceWorkerAndRefresh();
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      location.reload();
    }
  }

  return (
    <div className="grow max-h-[calc(100vh_-_92px)] overflow-auto">
      <div className="flex justify-center text-xl font-semibold">Settings</div>
      <div className="flex justify-center">Version 0.1.0</div>
      <div className="flex justify-center mt-4">
        <Button onClick={updateApp}>Update</Button>
      </div>
    </div>
  );
}

export default Settings;
