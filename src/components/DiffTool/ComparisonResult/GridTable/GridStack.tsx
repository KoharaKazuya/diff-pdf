import { View } from "@adobe/react-spectrum";
import { Children, ComponentProps, ReactNode } from "react";

type Props = Pick<ComponentProps<typeof View>, "gridColumnStart"> & {
  children?: ReactNode;
};

export default function GridStack({ gridColumnStart, children }: Props) {
  return (
    <>
      {Children.map(children, (child, i) => (
        <View gridColumnStart={gridColumnStart} gridRowStart={`${i + 1}`}>
          {child}
        </View>
      ))}
    </>
  );
}
