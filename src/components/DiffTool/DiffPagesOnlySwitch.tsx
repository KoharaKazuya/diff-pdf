import { Switch } from "@adobe/react-spectrum";
import { useDiffPagesOnlyState } from "../../features/diff-tool";

export default function DiffPagesOnlySwitch() {
  const [isDiffPagesOnly, setIsDiffPagesOnly] = useDiffPagesOnlyState();

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
