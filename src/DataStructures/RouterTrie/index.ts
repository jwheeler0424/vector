import { type HandlerFunction, RouterNode } from "./RouterNode"

export type RouterTrieInterface = {
  insert(path: string, handler: HandlerFunction): void;
  // find(value: string): IRadixNode<DataType> | undefined;
  // remove(key: string | string[]): void;
  // contains(key: string | string[]): boolean;
  // startsWith(prefix: string): Promise<Array<string>>;
  // reset(): void;
  // display(): void;
  // toObject(): Record<string, unknown>
  // toString(): string;
  // getDepth(): number;
}

export default class RouterTrie implements RouterTrieInterface {
  private root: RouterNode;

  constructor() {
    this.root = new RouterNode();
  }

  insert(path: string, handler: HandlerFunction): void {
    if (!path) {
      throw new Error('Path is required');
    }

    const pathChunks = path.split('/').slice(1);

    let currentNode = this.root;

    pathChunks.forEach((chunk, index) => {
      const child = currentNode.children.get(chunk);
      const isLeaf = index === pathChunks.length - 1;
      const isParam = chunk.startsWith(':');
      const isWildcard = chunk === '*';
      const isRegex = chunk.startsWith('(') && chunk.endsWith(')');

      if (child && isLeaf) {
        throw new Error('Path already exists');
      }

      if (!child) {
        currentNode.children.set(chunk, new RouterNode(chunk, currentNode, handler, isLeaf, isRegex, isParam, isWildcard));
        return;
      }

      currentNode = child;
    });
    
  }

  /* Helper Methods */
}