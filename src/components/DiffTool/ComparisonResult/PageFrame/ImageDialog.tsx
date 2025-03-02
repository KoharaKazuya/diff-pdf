import {
  ActionButton,
  Content,
  Dialog,
  DialogContainer,
} from "@adobe/react-spectrum";
import CrossLarge from "@spectrum-icons/ui/CrossLarge";

type Props = {
  isOpen?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
};

export default function ImageDialog({
  isOpen,
  onDismiss = () => {},
  children,
}: Props) {
  return (
    <DialogContainer type="fullscreen" isDismissable onDismiss={onDismiss}>
      {isOpen && (
        <Dialog>
          <Content>{children}</Content>
          <ActionButton
            isQuiet
            aria-label="閉じる"
            onPress={onDismiss}
            position="absolute"
            top={12}
            right={12}
          >
            <CrossLarge />
          </ActionButton>
        </Dialog>
      )}
    </DialogContainer>
  );
}
