import { Subject } from 'rxjs';
import { AbortExecutionError, ProcessNode } from './types';

export class NodeVisitor {
  currentNode: ProcessNode | undefined;

  nodes: ProcessNode[];

  nodesSeen: { [key: string]: number } = {};

  constructor(nodes: ProcessNode[]) {
    this.nodes = nodes;
  }

  setup() {
    this.nodes.forEach((node) => (this.nodesSeen[node._id] = 0));
    this.currentNode = this.nodes.find((n) => n.start);
  }

  async traverse(): Promise<void> {
    let targetOutput: string | null = null;
    while (this.currentNode) {
      this.currentNode.node.selectedOutput = 0;
      targetOutput = null;
      try {
        await this.executeNode();
      } catch (err) {
        if (err instanceof AbortExecutionError) {
          return;
        } else {
          console.error(err);
          break;
        }
      }
      this.nodesSeen[this.currentNode._id]++;
      const outputIndx = this.currentNode.node.selectedOutput;
      // At this point we know outputIndx to be connected (legacy check)
      targetOutput = this.currentNode?.outputs[outputIndx];
      const nextNode = this.nodes.find((n) => n._id === targetOutput) || null;
      if (!nextNode) {
        break;
      }
      this.currentNode = nextNode;
    }
  }

  private async executeNode() {
    const target = this.currentNode?.node;
    return target?.execute();
  }
}
