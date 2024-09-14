import { BOOK_INDEXES } from "./constant";
import { bookType, db as dbType } from "./types";
export default class BookIDB {
  dbName: string;
  version: number;
  tableName: string;
  db: {
    [e: string]: any;
  } | null;
  indexes: { [e: string]: any };

  constructor() {
    this.dbName = "books";
    this.tableName = "booksDetails";
    this.version = 1;
    this.db = null;
    this.indexes = BOOK_INDEXES;
  }
  async open() {
    return new Promise((resolve, reject) => {
      const requestToDB = indexedDB.open(this.dbName, this.version);
      requestToDB.addEventListener("success", (e: Event) => {
        console.debug("book db opened successfully", e);

        const target = e.target as IDBRequest;
        this.db = target.result;

        resolve(this.db);
      });

      requestToDB.addEventListener("upgradeneeded", (e) => {
        console.debug(
          "need to create the new book db with new version",
          this.version
        );

        const target = e.target as IDBRequest;
        const db = target.result;

        const bookTable = db.createObjectStore(this.tableName, {
          keyPath: "id",
        });
        bookTable.createIndex("authorIndex", "author", { unique: false });
        bookTable.createIndex("titleIndex", "title", { unique: false });
        bookTable.createIndex("publishedIndex", "publishedDate", {
          unique: false,
        });

        bookTable.createIndex("publisherIndex", "publisher", {
          unique: false,
        });
        bookTable.createIndex("bookSize", "pageCount", {
          unique: false,
        });
      });

      requestToDB.addEventListener("error", (e) => {
        console.error("Unable to load the books");
        reject(e);
      });
    });
  }

  async getResult(
    indexToQuery: string,
    query: string | number,
    fetchAll: boolean
  ) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("There is no db exist");
        return;
      }
      const tx = this.db.transaction(this.tableName, "readonly");
      const table = tx.objectStore(this.tableName);
      const titleIdx = table.index(indexToQuery);
      const data = fetchAll ? titleIdx.getAll(query) : titleIdx.get(query);

      data.addEventListener("success", (e: Event) => {
        const result = (e.target as IDBRequest).result as IDBCursorWithValue;
        resolve(result);
      });

      data.addEventListener("error", (e: Event) => {
        const result = (e.target as IDBRequest).result as IDBCursorWithValue;
        resolve(`Unable to get the query result ${query} ${result}`);
      });
    });
  }

  async addBook(book: bookType) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("There is no db exist");
        return;
      }

      const tx = this.db.transaction(this.tableName, "readwrite");
      const table = tx.objectStore(this.tableName);

      const addRequest = table.put(book);

      addRequest.addEventListener("success", (e: Event) => {
        console.debug("Added the new record", book);
        resolve("Added the new record");
      });

      addRequest.addEventListener("error", (e: Event) => {
        console.debug("Unalbe to add the new record", book);
        reject("Unalbe to add the new record");
      });
    });
  }
}
