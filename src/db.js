import { openDB } from 'idb';

export const dbPromise = openDB('mcq-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('mcqs')) {
      db.createObjectStore('mcqs', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('results')) {
      db.createObjectStore('results', { keyPath: 'date' });
    }
    if (!db.objectStoreNames.contains('wrong')) {
      db.createObjectStore('wrong', { keyPath: 'id' });
    }
  },
});

export async function addMCQs(mcqs) {
  const db = await dbPromise;
  for (const q of mcqs) {
    await db.put('mcqs', q);
  }
}

export async function getMCQs() {
  const db = await dbPromise;
  return await db.getAll('mcqs');
}

export async function saveResult(result) {
  const db = await dbPromise;
  await db.put('results', result);
}

export async function getResults() {
  const db = await dbPromise;
  return await db.getAll('results');
}

export async function saveWrong(questions) {
  const db = await dbPromise;
  for (const q of questions) {
    await db.put('wrong', q);
  }
}

export async function getWrong() {
  const db = await dbPromise;
  return await db.getAll('wrong');
}

export async function clearWrong() {
  const db = await dbPromise;
  const tx = db.transaction('wrong', 'readwrite');
  await tx.objectStore('wrong').clear();
  await tx.done;
}
