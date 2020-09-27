import { KVSIndexedDB, kvsIndexedDB } from "@kvs/indexeddb";
import { v4 as uuid } from "uuid";

export type Id = string;

export interface Pdf {
  id: Id;
  registeredAt: Date;
  file: File;
}

type StorageSchema = {
  pdfs: Pdf[];
};

export class PdfStorage {
  private storage: KVSIndexedDB<StorageSchema> | undefined;

  private async setup() {
    if (this.storage) return;
    this.storage = await kvsIndexedDB<StorageSchema>({
      name: "diff-pdf",
      version: 1,
    });
  }

  public async add(file: File): Promise<Id> {
    await this.setup();

    const pdfs = await this.getAll();

    const id = uuid();
    pdfs.unshift({ id, registeredAt: new Date(), file });
    await this.storage!.set("pdfs", pdfs);

    return id;
  }

  public async getAll(): Promise<Pdf[]> {
    await this.setup();

    return (await this.storage!.get("pdfs")) || [];
  }
}
