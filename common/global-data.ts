import path from 'path';
import { promises as fs } from 'fs';
import { Toggles } from '@weco/toggles';

abstract class GlobalDataStore<Value> {
  abstract readonly key: string;
  abstract fetch(): Promise<Value>;
  private value: Value | undefined;

  private async writeFile(value: Value): Promise<void> {
    const filePath = path.resolve(process.cwd(), '.global-data-store');
    const fileName = path.resolve(
      process.cwd(),
      '.global-data-store',
      `${this.key}.json`
    );

    try {
      await fs.mkdir(filePath, { recursive: true });
      await fs.writeFile(fileName, JSON.stringify(value));
    } catch (e) {
      console.info(`Could not writeFile ${fileName}`);
      throw e;
    }
  }

  private async readFile(): Promise<Value> {
    const fileName = path.resolve(
      process.cwd(),
      '.global-data-store',
      `${this.key}.json`
    );

    try {
      const data = await fs.readFile(fileName, { encoding: 'utf8' });
      return JSON.parse(data);
    } catch (e) {
      console.info(`Could not readFile ${fileName}`);
      throw e;
    }
  }

  async getValue(): Promise<Value> {
    if (!this.value) {
      const value = await this.readFile();
      this.value = value;
    }

    return this.value;
  }

  async storeValue(): Promise<void> {
    try {
      const data = await this.fetch();
      await this.writeFile(data);
      this.value = data;
    } catch (e) {
      console.info(`Could not storeValue ${this.key}`);
      throw e;
    }
  }
}

class TogglesStore extends GlobalDataStore<Toggles> {
  key = 'toggles';
  defaultValue = {};

  async fetch() {
    const data = await fetch(
      'https://toggles.wellcomecollection.org/toggles.json'
    ).then(resp => resp.json());

    return data;
  }
}

export { TogglesStore, GlobalDataStore };
