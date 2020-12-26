import { DBSchema, IDBPDatabase, openDB, StoreKey } from "idb";
import mitt from "mitt";

export interface UserSettings {
  quickTourCompleted: boolean;
}

const initialUserSettings: UserSettings = {
  quickTourCompleted: false,
};

export interface PdfFileMeta {
  id: number;
  name: string;
  size: number;
  registeredAt: Date;
}

interface Schema extends DBSchema {
  "user-settings": {
    key: "default";
    value: UserSettings;
  };
  "file-metas": {
    key: number;
    value: PdfFileMeta;
  };
  files: {
    key: number;
    value: File;
  };
}

export class BrowserStorage {
  private emitter = mitt();

  private dbPromise: Promise<IDBPDatabase<Schema>> | undefined;
  private setupDB() {
    if (!this.dbPromise)
      this.dbPromise = openDB<Schema>("diff-pdf", 2, {
        upgrade(db, oldVersion) {
          if (oldVersion < 1) {
            db.createObjectStore("file-metas", { keyPath: "id" });
            db.createObjectStore("files", { autoIncrement: true });
          }
          if (oldVersion < 2) {
            const store = db.createObjectStore("user-settings");
            store.put(initialUserSettings, "default");
          }
        },
        blocked() {
          alert(
            "安全に内部データをアップデートするため、このサイトを開いている他のタブをすべて閉じてください。"
          );
        },
      });
    return this.dbPromise;
  }

  public async getUserSettings(): Promise<UserSettings> {
    const db = await this.setupDB();
    const settings = await db.get("user-settings", "default");
    if (!settings) throw new Error("cannot find user setttings");
    return settings;
  }

  public async setUserSettings(settings: UserSettings): Promise<void> {
    const db = await this.setupDB();
    await db.put("user-settings", settings, "default");
    this.emitter.emit("user-settings");
  }

  public onChangeUserSettings(listener: () => void): () => void {
    this.emitter.on("user-settings", listener);
    return () => this.emitter.off("user-settings", listener);
  }

  public async addPdfFile(file: File): Promise<StoreKey<Schema, "files">> {
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

    this.emitter.emit("pdfs");

    return key;
  }

  public async getAllPdfFiles(): Promise<PdfFileMeta[]> {
    const db = await this.setupDB();
    const metas = await db.getAll("file-metas");
    return metas;
  }

  public async getPdfFile(id: StoreKey<Schema, "files">): Promise<File> {
    const db = await this.setupDB();
    const file = await db.get("files", id);
    if (!file) throw new Error("no such file: id=" + id);
    return file;
  }

  public onChangePdf(listener: () => void): () => void {
    this.emitter.on("pdfs", listener);
    return () => this.emitter.off("pdfs", listener);
  }
}
