import { Subject } from "rxjs";
import { NodeVisitor } from "./node-visitor";
import { ChatMessage, ProcessNode, Thread } from "./types";
import DataStore from "./data-store";
import { AbstractNode } from "../node/abstract-node";
import * as dayjs from "dayjs";

export function hashCode(str: string) {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString();
}


export class ProcessParser {
  private _thread?: Thread;

  public get thread(): Thread | undefined {
    return this._thread;
  }

  public set thread(thread: Thread | undefined) {
    this._thread = thread;
  }

  public onMessage = new Subject<ChatMessage[]>();

  visitor?: NodeVisitor;

  replyPromise: ((value: any) => void) | null = null;

  reset() {
    if (this.onMessage) {
      this.onMessage.complete();
    }
    this.onMessage = new Subject<ChatMessage[]>();
    this.replyPromise = null;
  }

  get nodes(): ProcessNode[] {
    return this.thread?.nodeTemplate ?? [];
  }

  setupThread(nodeTemplate: ProcessNode[]) {
    this.thread = {
      chat: [],
      dataStore: new DataStore(),
      nodeTemplate
    }
  }

  start(onFinish?: () => void): void {
    if (!this.thread) return;
    this.thread.nodeTemplate?.forEach((node) => (node.node.ctx = this));
    if (!this.thread.nodeTemplate) return;
    this.visitor = new NodeVisitor(this.thread.nodeTemplate);
    this.visitor.setup();
    this.visitor.traverse().then(onFinish);
  }

  selectOutput(nodeRef: AbstractNode, index: number): boolean {
    const bpN = this.thread?.nodeTemplate?.find((n) => n.node === nodeRef);
    if (!bpN || !bpN.outputs || bpN.outputs.length <= index) {
      return false;
    }
    return bpN.outputs[index] !== null;
  }

  reply(message: ChatMessage, delay = 750): Promise<void> {
    if (!this.replyPromise || !this.thread || !this.thread?.chat[this.thread.chat.length - 1]?.responseRequest) {
      return Promise.reject();
    }
    this.thread.chat[this.thread.chat.length - 1].responseRequest!.response = message.id;
    const content = message.content;
    this.thread.chat.push(message);
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        this.replyPromise?.(content);
        resolve();
      }, delay);
    });
  }

  prompt(
    text: string,
    defaultValue: any
  ) {
    const data: ChatMessage = {
      id: `prompt_${hashCode(text)}`,
      content: text,
      responseRequest: {
        placeholder: defaultValue,
      },
    };

    const curNode = this.visitor?.currentNode;
    if (curNode) {
      data.associatedBlock = {
        id: curNode._id,
        index: this.visitor?.nodesSeen[curNode._id] ?? -1,
      };
    }

    this.newMessage(data);
    return new Promise<unknown>((resolve) => {
      this.replyPromise = resolve;
    });
  }

  print(text: string) {
    const data: ChatMessage = {
      content: text,
      id: `print_${hashCode(text)}`,
    };

    const curNode = this.visitor?.currentNode;
    if (curNode) {
      data.associatedBlock = {
        id: curNode._id,
        index: this.visitor?.nodesSeen[curNode._id] ?? -1,
      };
    }

    this.newMessage(data);
  }

  getNodeId(node: AbstractNode): string | undefined {
    return this.thread?.nodeTemplate?.find((n) => n.node === node)?._id ?? undefined;
  }

  get dataStore() {
    return this.thread?.dataStore;
  }

  private newMessage(data: ChatMessage) {
    let i = 0;
    this.thread?.chat.push(data);
    this.onMessage.next(this.thread?.chat ?? []);
  }
}
