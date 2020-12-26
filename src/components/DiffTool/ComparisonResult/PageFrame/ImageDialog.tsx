import { Content, Dialog, DialogContainer } from "@adobe/react-spectrum";
import type { ReactNode } from "react";
import Centerize from "../../../Centerize";

type Props = {
  onDismiss?: () => void;
  children?: ReactNode;
};

export default function ImageDialog({ onDismiss = () => {}, children }: Props) {
  return (
    <DialogContainer isDismissable onDismiss={onDismiss}>
      <Dialog>
        <Content>
          <Centerize>{children}</Centerize>
        </Content>
      </Dialog>
    </DialogContainer>
  );
}
