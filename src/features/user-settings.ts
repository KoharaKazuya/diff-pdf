import constate from "constate";
import { useEffect, useMemo } from "react";
import { useAsync } from "react-async-hook";
import { BrowserStorage } from "../browser-storage";

function useUserSettings() {
  const storage = useMemo(() => new BrowserStorage(), []);
  const { result: userSettings, execute } = useAsync(getUserSettings, [
    storage,
  ]);

  useEffect(
    () =>
      storage.onChangeUserSettings(() => {
        execute(storage);
      }),
    [storage]
  );

  const completeQuickTour = () => {
    if (!userSettings) return;
    storage.setUserSettings({ ...userSettings, quickTourCompleted: true });
  };

  return { userSettings, completeQuickTour };
}

function getUserSettings(storage: BrowserStorage) {
  return storage.getUserSettings();
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
