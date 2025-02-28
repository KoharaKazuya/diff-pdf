import { createContext, ReactNode, use, useEffect } from "react";
import { useAsync } from "react-async-hook";
import type { Storage } from "../browser-storage";
import { useStorage } from "./browser-storage";

const QuickTourCompletedContext = createContext<boolean>(true);
const CompleteQuickTourContext = createContext<() => void>(() => {});

export function UserSettingsStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const storage = useStorage();
  const { result: userSettings, execute } = useAsync(
    async (storage: Storage | undefined) => {
      return await storage?.getUserSettings();
    },
    [storage],
  );

  useEffect(
    () =>
      storage?.onChangeUserSettings(() => {
        execute(storage);
      }),
    [storage],
  );

  const completeQuickTour = () => {
    if (!userSettings) return;
    storage?.setUserSettings({ ...userSettings, quickTourCompleted: true });
  };

  return (
    <QuickTourCompletedContext value={userSettings?.quickTourCompleted ?? true}>
      <CompleteQuickTourContext value={completeQuickTour}>
        {children}
      </CompleteQuickTourContext>
    </QuickTourCompletedContext>
  );
}

export function useQuickTourCompleted() {
  return use(QuickTourCompletedContext);
}

export function useCompleteQuickTour() {
  return use(CompleteQuickTourContext);
}
