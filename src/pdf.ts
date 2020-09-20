export interface Parser {
  parse(): Promise<Document>;
}

export interface Document {
  numPages: number;
  getPage(index: number): Promise<Page>;
}

export interface Page {
  render(): Promise<ImageData>;
}
