import { View } from "@adobe/react-spectrum";
import { Children, ComponentProps } from "react";

type Props = Pick<ComponentProps<typeof View>, "gridColumnStart"> & {
  children?: React.ReactNode;
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
