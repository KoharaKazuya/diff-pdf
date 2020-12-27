import constate from "constate";
import { useEffect } from "react";
import { useAsync } from "react-async-hook";
import type { Storage } from "../browser-storage";
import { useBrowserStorage } from "./browser-storage";

function useUserSettings() {
  const storage = useBrowserStorage();
  const { result: userSettings, execute } = useAsync(getUserSettings, [
    storage,
  ]);

  useEffect(
    () =>
      storage?.onChangeUserSettings(() => {
        execute(storage);
      }),
    [storage]
  );

  const completeQuickTour = () => {
    if (!userSettings) return;
    storage?.setUserSettings({ ...userSettings, quickTourCompleted: true });
  };

  return { userSettings, completeQuickTour };
}

async function getUserSettings(storage: Storage | undefined) {
  return await storage?.getUserSettings();
}

export const [
  UserSettingsProvider,
  useQuickTourCompleted,
  useCompleteQuickTour,
] = constate(
  useUserSettings,
  ({ userSettings }: ReturnType<typeof useUserSettings>) =>
    userSettings?.quickTourCompleted ?? true,
  ({ completeQuickTour }: ReturnType<typeof useUserSettings>) =>
    completeQuickTour
);
