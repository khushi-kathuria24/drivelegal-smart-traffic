"use client"
// Minimal IndexedDB wrapper for storing cached laws and an outbox queue
import { openDB, deleteDB } from 'idb'

const DB_NAME = 'mvapp-offline-db'
const DB_VERSION = 1

let dbPromise: Promise<any> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('laws')) {
          db.createObjectStore('laws', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('outbox')) {
          db.createObjectStore('outbox', { keyPath: 'cid', autoIncrement: true })
        }
      },
    })
  }
  return dbPromise
}

export async function cacheLaws(laws: any[]) {
  const db = await getDB()
  const tx = db.transaction('laws', 'readwrite')
  for (const law of laws) {
    await tx.store.put(law)
  }
  await tx.done
}

export async function getCachedLaws() {
  const db = await getDB()
  return await db.getAll('laws')
}

export async function addToOutbox(item: any) {
  const db = await getDB()
  const id = await db.add('outbox', item)
  // Try to register a background sync so the service worker can flush the outbox
  try {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const reg = await navigator.serviceWorker.ready
      try {
        await (reg as any).sync.register('sync-outbox')
      } catch (e) {
        // registration may fail silently on some browsers
        console.warn('Sync register failed', e)
      }
    }
  } catch (e) {
    // navigator may be undefined in some test environments
  }

  return id
}

export async function getOutboxItems() {
  const db = await getDB()
  return await db.getAll('outbox')
}

export async function clearOutbox() {
  const db = await getDB()
  const tx = db.transaction('outbox', 'readwrite')
  await tx.store.clear()
  await tx.done
}

export async function deleteDatabase() {
  await deleteDB(DB_NAME)
  dbPromise = null
}

export default {
  cacheLaws,
  getCachedLaws,
  addToOutbox,
  getOutboxItems,
  clearOutbox,
  deleteDatabase,
}
