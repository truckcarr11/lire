import { Button } from "@mantine/core";

function Settings() {
  return (
    <div className="grow max-h-[calc(100vh_-_92px)] overflow-auto">
      <div className="flex justify-center text-xl font-semibold">Settings</div>
      <div className="flex justify-center">Version 0.0.1</div>
      <div className="flex justify-center mt-4">
        <Button onClick={() => location.reload(true)}>Update</Button>
      </div>
    </div>
  );
}

export default Settings;
