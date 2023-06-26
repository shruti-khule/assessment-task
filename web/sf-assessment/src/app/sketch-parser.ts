import { AbstractNode } from "./node/abstract-node";
import { allNodes } from "./node/all-nodes";
import { ProcessNode } from "./parser/types";

export class SketchParser {

  static buildNode(
    type: string,
    config: { [key: string]: any }
  ): AbstractNode | undefined {
    const classRef = allNodes[type];
    if (!classRef) {
      return undefined;
    }
    const instance = new classRef();
    if (config) {
      instance.config = Object.keys(config).reduce((prev: { [key: string]: any }, cur) => {
        prev[cur] = { value: config[cur] };
        return prev;
      }, {});
    }
    return instance;
  }
}
