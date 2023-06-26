import { AbstractNode } from "./abstract-node";
import { PromptNode } from "./prompt-node";
import { SignNode } from "./signature-node";

export const allNodes: {[key: string]: typeof PromptNode} = {
  PromptNode,
  SignNode
};