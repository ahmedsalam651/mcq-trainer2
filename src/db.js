import { openDB } from 'idb';

export const dbPromise = openDB('mcq-db', 1, {
  upgrade(db) {
    db.createObjectStore('mcqs', { keyPath: 'id' });
    db.createObjectStore('results', { keyPath: 'date' });
  },
});

export async function addMCQs(mcqs) {
  const db = await dbPromise;
  for (const q of mcqs) await db.put('mcqs', q);
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
