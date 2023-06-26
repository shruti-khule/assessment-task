export type DataStoreEntry = { data: any[]; type: string | undefined };

class DataStore {
  private _value: { [key: string]: DataStoreEntry } = {};

  public set(key: string, value: any, type?: string, override = false): void {
    if (!this._value[key] || override) {
      this._value[key] = { data: [], type };
    }
    this._value[key].data.push(value);
  }

  public get(key: string, full?: boolean): any {
    const direct = this._value[key]?.data;
    if (!direct?.length) {
      return null;
    }
    const val = direct;
    if (!val?.length) return null;
    if (full) {
      return val;
    }
    return val[val.length - 1];
  }

  public type(key: string): string | undefined {
    if (!this._value[key]?.type) {
      return undefined;
    }
    return this._value[key].type;
  }

  public get keys(): string[] {
    return Object.keys(this._value);
  }

  public delete(key: string): void {
    if (this._value[key]) {
      this._value[key].data.pop();
      if (this._value[key].data.length <= 0) {
        delete this._value[key];
      }
    }
  }

  toJSON(): any {
    return this._value;
  }

  parseFrom(json: { [key: string]: any }): void {
    this._value = json;
  }

  constructor(initialValue?: { [key: string]: any }) {
    if (initialValue) {
      Object.keys(initialValue).forEach((key) => {
        this.set(key, initialValue[key]);
      });
    }
  }
}

export default DataStore;
