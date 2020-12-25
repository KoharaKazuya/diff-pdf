import { Grid } from "@adobe/react-spectrum";
import type { ReactNode } from "react";
import GridStack from "./GridTable/GridStack";

type Props = {
  left?: ReactNode[];
  center?: ReactNode[];
  right?: ReactNode[];
};

export default function GridTable({ left, center, right }: Props) {
  return (
    <Grid columns={["1fr", "1fr", "1fr"]} gap="size-100" margin="size-100">
      <GridStack gridColumnStart="1">{left}</GridStack>
      <GridStack gridColumnStart="2">{center}</GridStack>
      <GridStack gridColumnStart="3">{right}</GridStack>
    </Grid>
  );
}
