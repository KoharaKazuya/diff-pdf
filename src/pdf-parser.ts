import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import * as pdfjsLib from "pdfjs-dist";
import type { Document, Page, Parser } from "./pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs-dist/build/pdf.worker.mjs";

export class PdfParser implements Parser {
  public readonly id = Math.random().toString(16).slice(-8);

  constructor(private readonly file: File) {}

  private parsing: Promise<PdfDocument> | undefined;
  parse(): Promise<Document> {
    if (this.parsing) return this.parsing;
    return (this.parsing = (async () => {
      const buffer = await this.file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: buffer,
        cMapUrl: "/pdfjs-dist/cmaps/",
        cMapPacked: true,
      }).promise;
      return new PdfDocument(pdf);
    })());
  }
}

export class PdfDocument implements Document {
  constructor(private readonly document: PDFDocumentProxy) {}

  get numPages(): number {
    return this.document.numPages;
  }

  private pages: (Promise<Page> | undefined)[] = [];
  getPage(index: number): Promise<Page> {
    if (this.pages[index]) return this.pages[index];
    return (this.pages[index] = (async () => {
      const p = await this.document.getPage(index);
      return new PdfPage(p);
    })());
  }
}

export class PdfPage implements Page {
  constructor(private readonly page: PDFPageProxy) {}

  private imageData: Promise<ImageData> | undefined;
  render(): Promise<ImageData> {
    if (this.imageData) return this.imageData;
    return (this.imageData = (async () => {
      const viewport = this.page.getViewport({ scale: 1 });
      const { width, height } = viewport;

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("cannot get 2d context from OffscreenCanvas");

      await this.page.render({
        canvasContext: (ctx as unknown) as CanvasRenderingContext2D,
        viewport,
      }).promise;

      return ctx.getImageData(0, 0, width, height);
    })());
  }
}

function createCanvas(width: number, height: number) {
  if (typeof OffscreenCanvas !== "undefined")
    return new OffscreenCanvas(width, height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
