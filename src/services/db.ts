import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Protocol } from '../types';

interface MyDB extends DBSchema {
  protocols: {
    key: number;
    value: Protocol;
  };
  regions: {
    key: string;
    value: string;
  };
  executors: {
    key: string;
    value: string;
  };
}

const DB_NAME = 'ProtocolsDB';
const DB_VERSION = 1;

let db: IDBPDatabase<MyDB>;

export const initDB = async () => {
  db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('protocols', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('regions', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('executors', { keyPath: 'id', autoIncrement: true });
    },
  });
};

export const getAllProtocols = async (): Promise<Protocol[]> => {
  return db.getAll('protocols');
};

export const addProtocol = async (protocol: Protocol): Promise<number> => {
  return db.add('protocols', protocol);
};

export const updateProtocol = async (protocol: Protocol): Promise<number> => {
  return db.put('protocols', protocol);
};

export const deleteProtocol = async (id: number): Promise<void> => {
  return db.delete('protocols', id);
};

export const getAllRegions = async (): Promise<string[]> => {
  const regions = await db.getAll('regions');
  return regions.map(r => r.value);
};

export const addRegion = async (region: string): Promise<void> => {
  await db.add('regions', { value: region });
};

export const deleteRegion = async (region: string): Promise<void> => {
  const key = await db.getKeyFromIndex('regions', 'value', region);
  if (key) {
    await db.delete('regions', key);
  }
};

export const getAllExecutors = async (): Promise<string[]> => {
  const executors = await db.getAll('executors');
  return executors.map(e => e.value);
};

export const addExecutor = async (executor: string): Promise<void> => {
  await db.add('executors', { value: executor });
};

export const deleteExecutor = async (executor: string): Promise<void> => {
  const key = await db.getKeyFromIndex('executors', 'value', executor);
  if (key) {
    await db.delete('executors', key);
  }
};