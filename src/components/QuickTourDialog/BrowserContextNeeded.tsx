import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Heading,
} from "@adobe/react-spectrum";
import { useCompleteQuickTour } from "../../features/user-settings";
import SiteDescription from "../SiteDescription";

export default function BrowserContextNeeded() {
  const complete = useCompleteQuickTour();

  return (
    <DialogContainer onDismiss={() => {}}>
      <Dialog>
        <Heading>このサイトについて</Heading>
        <Divider />
        <Content>
          <SiteDescription />
        </Content>
        <ButtonGroup>
          <Button variant="primary" onPress={complete}>
            使ってみる
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogContainer>
  );
}
