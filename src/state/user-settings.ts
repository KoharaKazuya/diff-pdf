import constate from "constate";
import { useEffect } from "react";
import { useAsync } from "react-async-hook";
import type { Storage } from "../browser-storage";
import { useStorage } from "./browser-storage";

function useUserSettingsStateInner() {
  const storage = useStorage();
  const { result: userSettings, execute } = useAsync(
    async (storage: Storage | undefined) => {
      return await storage?.getUserSettings();
    },
    [storage]
  );

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
export const [
  UserSettingsStateProvider,
  useQuickTourCompleted,
  useCompleteQuickTour,
] = constate(
  useUserSettingsStateInner,
  ({ userSettings }) => userSettings?.quickTourCompleted ?? true,
  ({ completeQuickTour }) => completeQuickTour
);
