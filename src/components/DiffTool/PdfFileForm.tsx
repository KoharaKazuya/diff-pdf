import { Form, Grid } from "@adobe/react-spectrum";
import { useSetPdfFileL, useSetPdfFileR } from "../../state/pdf-file";
import PdfFilePicker from "./PdfFileForm/PdfFilePicker";

export default function PdfFileForm() {
  const setPdfFileL = useSetPdfFileL();
  const setPdfFileR = useSetPdfFileR();

  return (
    <Form>
      <Grid columns={["1fr", "1fr"]}>
        <PdfFilePicker onPick={setPdfFileL} />
        <PdfFilePicker onPick={setPdfFileR} />
      </Grid>
    </Form>
  );
}
