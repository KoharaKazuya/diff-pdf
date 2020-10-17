import { Grid } from "@adobe/react-spectrum";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Centerize({ children }: Props) {
  return (
    <Grid width="100%" height="100%" alignItems="center" justifyItems="center">
      {children}
    </Grid>
  );
}
