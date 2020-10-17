import { DBSchema, IDBPDatabase, openDB, StoreKey } from "idb";

export interface PdfFileMeta {
  id: number;
  name: string;
  size: number;
  registeredAt: Date;
}

interface Schema extends DBSchema {
  "file-metas": {
    key: number;
    value: PdfFileMeta;
  };
  files: {
    key: number;
    value: File;
  };
}

export class PdfStorage {
  private dbCache: IDBPDatabase<Schema> | undefined;

  private async setupDB() {
    if (!this.dbCache)
      this.dbCache = await openDB<Schema>("diff-pdf", 1, {
        upgrade(db) {
          db.createObjectStore("file-metas", { keyPath: "id" });
          db.createObjectStore("files", { autoIncrement: true });
        },
      });
    return this.dbCache;
  }

  public async add(file: File): Promise<StoreKey<Schema, "files">> {
    const db = await this.setupDB();
    const tx = db.transaction(["file-metas", "files"], "readwrite");
    const key = await tx.objectStore("files").add(file);
    await tx.objectStore("file-metas").put({
      id: key,
      name: file.name,
      size: file.size,
      registeredAt: new Date(),
    });
    await tx.done;
    return key;
  }

  public async getAll(): Promise<PdfFileMeta[]> {
    const db = await this.setupDB();
    const metas = await db.getAll("file-metas");
    return metas;
  }

  public async get(id: StoreKey<Schema, "files">): Promise<File> {
    const db = await this.setupDB();
    const file = await db.get("files", id);
    if (!file) throw new Error("no such file: id=" + id);
    return file;
  }
}
