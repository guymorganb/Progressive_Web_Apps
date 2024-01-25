// the idb library which is a lightweight, promised-based wrapper around IndexedDB.
import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// The putDb method will store content into the 'jate' object store. 
// The primary key is automatically incremented thanks to the 
// { keyPath: 'id', autoIncrement: true } configuration in the object store..
export const putDb = async (content) => {
  try {
      const db = await openDB('jate', 1); // Open the database
      const tx = db.transaction('jate', 'readwrite'); // Begin a transaction
      const store = tx.objectStore('jate'); // Get the object store
      await store.put({ value: content, id: 1 }); // Add the content to the store
      console.log('Content added to the jate database.');
  } catch (error) {
      console.error('Error adding content to the jate database:', error);
  }
};

// The getDb method retrieves all the entries from the 'jate' object store and returns them as an array.
export const getDb = async () => {
  try {
      const db = await openDB('jate', 1);
      const tx = db.transaction('jate', 'readonly');
      const store = tx.objectStore('jate');
      const allContent = await store.get(1);
      return allContent?.value;
  } catch (error) {
      console.error('Error retrieving content from the jate database:', error);
  }
};


initdb();
