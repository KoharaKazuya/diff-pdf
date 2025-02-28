import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  use,
  useState,
} from "react";

const IsDiffPagesOnlyStateContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}]);

export function IsDiffPagesOnlyStateProvider({
  children,
}: {
  children?: ReactNode;
}) {
  const state = useState(false);
  return (
    <IsDiffPagesOnlyStateContext value={state}>
      {children}
    </IsDiffPagesOnlyStateContext>
  );
}

export function useIsDiffPagesOnlyState() {
  return use(IsDiffPagesOnlyStateContext);
}
