import { DBSchema, IDBPDatabase, openDB, StoreKey } from "idb";
import mitt from "mitt";

const MAX_FILES = 10;

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

export interface Storage {
  getUserSettings(): Promise<UserSettings>;
  setUserSettings(settings: UserSettings): Promise<void>;
  onChangeUserSettings(listener: () => void): () => void;
  addPdfFile(file: File): Promise<StoreKey<Schema, "files">>;
  getAllPdfFiles(): Promise<PdfFileMeta[]>;
  getPdfFile(id: StoreKey<Schema, "files">): Promise<File>;
  onChangePdf(listener: () => void): () => void;
}

/**
 * ブラウザ上に存在するストレージ
 *
 * データは特定のデバイス上の特定のブラウザ上の固有な値として保存され、ページ遷移やタブの開閉、
 * ブラウザの終了を越えて生存する。
 */
export class BrowserStorage implements Storage {
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
    const fileMetasStore = tx.objectStore("file-metas");
    const filesStore = tx.objectStore("files");

    // remove exceeded files
    const count = await fileMetasStore.count();
    if (count + 1 > MAX_FILES) {
      const keys = await fileMetasStore.getAllKeys(
        undefined,
        count + 1 - MAX_FILES
      );
      await Promise.all([
        ...keys.map((key) => fileMetasStore.delete(key)),
        ...keys.map((key) => filesStore.delete(key)),
      ]);
    }

    // add new file
    const key = await filesStore.add(file);
    await fileMetasStore.put({
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

/**
 * BrowserStorage が利用できない場合 (Firefox, Safari のプライベートブランジング中) に
 * BrowserStorage の大体実装としてオンメモリのストレージを提供する
 *
 * オンメモリのため、リロードやページ遷移などでデータが破棄される。
 */
export class MemoryStorage implements Storage {
  private emitter = mitt();

  private backendStorage: {
    [K in keyof Schema]: Map<Schema[K]["key"], Schema[K]["value"]>;
  } = {
    "user-settings": new Map(),
    "file-metas": new Map(),
    files: new Map(),
  };
  private nextFileKey = 1;

  constructor() {
    this.backendStorage["user-settings"].set("default", {
      quickTourCompleted: false,
    });
  }

  public async getUserSettings(): Promise<UserSettings> {
    return this.backendStorage["user-settings"].get("default")!;
  }

  public async setUserSettings(settings: UserSettings): Promise<void> {
    this.backendStorage["user-settings"].set("default", settings);
    this.emitter.emit("user-settings");
  }

  public onChangeUserSettings(listener: () => void): () => void {
    this.emitter.on("user-settings", listener);
    return () => this.emitter.off("user-settings", listener);
  }

  public async addPdfFile(file: File): Promise<StoreKey<Schema, "files">> {
    const metas = await this.getAllPdfFiles();
    const keysToDelete = metas
      .map((m) => m.id)
      .sort()
      .slice(0, -(MAX_FILES - 1));
    keysToDelete.forEach((key) => {
      this.backendStorage["file-metas"].delete(key);
      this.backendStorage["files"].delete(key);
    });

    const key = this.nextFileKey++;
    this.backendStorage["file-metas"].set(key, {
      id: key,
      name: file.name,
      size: file.size,
      registeredAt: new Date(),
    });
    this.backendStorage["files"].set(key, file);
    this.emitter.emit("pdfs");
    return key;
  }

  public async getAllPdfFiles(): Promise<PdfFileMeta[]> {
    const metas: PdfFileMeta[] = [];
    this.backendStorage["file-metas"].forEach((v) => metas.push(v));
    return metas;
  }

  public async getPdfFile(id: StoreKey<Schema, "files">): Promise<File> {
    const file = this.backendStorage["files"].get(id);
    if (!file) throw new Error("no such file: id=" + id);
    return file;
  }

  public onChangePdf(listener: () => void): () => void {
    this.emitter.on("pdfs", listener);
    return () => this.emitter.off("pdfs", listener);
  }
}

/**
 * IndexedDB が利用可能かどうか検出する
 */
export async function detectIndexedDBAccess(): Promise<boolean> {
  const testFile = new File(["dummy content"], `${Math.random()}`);
  try {
    const db = await openDB("indexeddb-feature-detection", 1, {
      upgrade(db) {
        db.createObjectStore("files");
      },
    });
    await db.put("files", testFile, "default");
    const stored = await db.get("files", "default");
    if (stored.name !== testFile.name) return false;
    return true;
  } catch (e) {
    console.debug("[IndexedDB availability detection] error:", e);
    return false;
  }
}
