import { Switch } from "@adobe/react-spectrum";
import { useIsDiffPagesOnlyState } from "../../state/is-diff-pages-only";

export default function DiffPagesOnlySwitch() {
  const [isDiffPagesOnly, setIsDiffPagesOnly] = useIsDiffPagesOnlyState();

  return (
    <Switch
      isSelected={isDiffPagesOnly}
      onChange={setIsDiffPagesOnly}
      margin="size-100"
    >
      差分があるページのみ表示する
    </Switch>
  );
}
