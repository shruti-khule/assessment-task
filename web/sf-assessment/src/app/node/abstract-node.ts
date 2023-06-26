import { Subject } from "rxjs";
import { ProcessParser } from "../parser/process-parser";
import { nodeNames } from "./node-names";
import DataStore from "../parser/data-store";

export abstract class AbstractNode {

  private context?: ProcessParser;

  private _refIds?: string[];

  config?: { [key: string]: any };


  abstract defaultConfig: { [key: string]: any };

  protected _identifier?: string;

  outputs: (string | null)[] = [''];

  outputsChange: Subject<((index: number) => number | null) | null> = new Subject();

  selectedOutput: number | undefined = 0;

  set ctx(ctx: ProcessParser) {
    this.context = ctx;
  }

  abstract execute(): Promise<void>;

  onAfterInit(): void {
    if (!this.config && this.defaultConfig) {
      this.config = this.defaultConfig;
    }
  }

  set refIds(ids: string[]) {
    this._refIds = ids;
  }

  get refIds(): string[] {
    return this._refIds ?? [];
  }

  get refId(): string | undefined {
    return this._refIds?.length ? this._refIds[0] : undefined;
  }

  set refId(id: string | undefined) {
    if (!id) {
      return;
    }
    if (this._refIds) {
      this._refIds[0] = id;
    } else {
      this._refIds = [id];
    }
  }

  get identifier(): string | undefined {
    return this._identifier;
  }

  get typeName(): string | undefined {
    return nodeNames[this._identifier ?? ''];
  }

  get message(): DataStore | undefined {
    return this.context?.dataStore;
  }

  setupOutputs(names: (string | null)[]): void {
    this.outputs = names;
    this.outputsChange.next(null);
  }

  selectOutput(index: number, fallbackIfNoConnection?: () => void): void {
    if (this.context?.selectOutput(this, index)) {
      this.selectedOutput = index;
    } else if (fallbackIfNoConnection) {
      fallbackIfNoConnection();
    } else {
      this.selectedOutput = undefined;
    }
  }

  protected prompt(
    text: string,
    defaultValue: any,
  ): Promise<unknown> {
    return new Promise((resolve) => {
      resolve(this.context?.prompt(text, defaultValue));
    });
  }

  protected print(text: string): void {
    this.context?.print(text);
  }
}