import fs from 'fs';
import path from 'path';
import { GlobalDataStore } from '../global-data';

beforeEach(async () => {
  fs.rmdirSync(path.join(process.cwd(), '.global-data-store'), {
    recursive: true,
  });
});

afterEach(async () => {
  fs.rmdirSync(path.join(process.cwd(), '.global-data-store'), {
    recursive: true,
  });
});

const testValue = {
  prop1: true,
  prop2: false,
};

class TestStore extends GlobalDataStore<Record<string, boolean>> {
  key = 'test';
  async fetch() {
    return testValue;
  }
}

it('makes fetched value accessible to new instance of class', async () => {
  const serverStore = new TestStore();
  await serverStore.storeValue();
  expect(serverStore.getValue()).resolves.toBe(testValue);

  const clientStore = new TestStore();
  expect(clientStore.getValue()).resolves.toStrictEqual(testValue);
});

it('throws if the file is not stored', async () => {
  const clientStore = new TestStore();
  const readUnsetvalue = async () => {
    await clientStore.getValue();
  };
  await expect(readUnsetvalue).rejects.toThrow();
});
