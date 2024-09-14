import { useEffect } from "react";
import BookIDB from "./store/bookIDB";
import "./styles.css";
import { BOOK_INDEXES } from "./store/constant";

const bookIDB = new BookIDB();

export default function App() {
  useEffect(() => {
    bookIDB.open();
  }, []);

  function addBook() {
    const data = [
      {
        id: Math.random(),
        title: "A great story",
        author: "anuj panwar",
        publishedDate: "2024-10-11",
        pageCount: 100,
        publisher: "Uttarakhand publications",
      },
      {
        id: Math.random(),
        title: "Rings of power",
        author: "Thorin",
        publishedDate: "2009-10-11",
        pageCount: 100,
        publisher: "Hollywood publications",
      },
      {
        id: Math.random(),
        title: "The Boys",
        author: "Billy",
        publishedDate: "2013-10-11",
        pageCount: 100,
        publisher: "Hollywood publications",
      },
    ];
    data.forEach(async (book) => {
      await bookIDB.addBook(book);
    });
  }

  async function getBook() {
    // try {
    //   const data = await bookIDB.getResult();
    //   console.log(data);
    // } catch (e) {
    //   console.error(e);
    // }
  }

  async function getByAuthor() {
    try {
      const data = await bookIDB.getResult(
        BOOK_INDEXES.author,
        "anuj panwar",
        true
      );
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function getByBookSize() {
    try {
      const data = await bookIDB.getResult(BOOK_INDEXES.pageCount, 100, true);
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="App">
      <button onClick={addBook}>Add Book</button>
      <button onClick={getBook}>get Book</button>
      <button onClick={getByAuthor}>Get by Author</button>
      <button onClick={getByBookSize}>Get by Size</button>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
