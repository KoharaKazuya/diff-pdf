import { Text } from "@adobe/react-spectrum";
import Centerize from "../shared/Centerize";

export default function NoMatch() {
  return (
    <Centerize>
      <Text UNSAFE_style={{ color: "var(--spectrum-global-color-gray-700)" }}>
        No Match
      </Text>
    </Centerize>
  );
}
