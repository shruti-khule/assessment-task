import { AbstractNode } from "../node/abstract-node";
import DataStore from "./data-store";

export interface ProcessNode {
  _id: string;
  node: AbstractNode;
  type?: string;
  outputs: (string | null)[];
  start?: boolean;
}

export interface ChatMessage {
  id: string;
  content: any;
  associatedBlock?: {
    id: string;
    index: number;
  };
  responseRequest?: {
    response?: string;
    placeholder?: string;
  };
}

export interface Thread {
  /* Intrinsic attributes */
  chat: ChatMessage[];
  dataStore: DataStore;
  nodeTemplate:  ProcessNode[];
}

export class AbortExecutionError extends Error {}
