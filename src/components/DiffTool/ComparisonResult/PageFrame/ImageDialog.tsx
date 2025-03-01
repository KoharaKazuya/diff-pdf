import { Content, Dialog, DialogContainer } from "@adobe/react-spectrum";
import Centerize from "../../../Centerize";

type Props = {
  onDismiss?: () => void;
  children?: React.ReactNode;
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
