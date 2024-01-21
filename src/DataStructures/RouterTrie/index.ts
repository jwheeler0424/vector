import type { HandlerFunction } from "@/types/handler";
import type { RouterNode } from "@/types/node";
import { Node } from "./Node";

export type RouterTrie = {
  insert(path: string, method: HttpMethod, handler: HandlerFunction): void;
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

export default class Trie implements RouterTrie {
  private root: RouterNode;

  constructor() {
    this.root = new Node();
  }

  insert(path: string, method: HttpMethod, handler: HandlerFunction): void {
    if (!path) {
      throw new Error('Path is required');
    }

    const pathChunks = path.split('/');
    const trailingSlash = path.at(-1) === '/' && path.length > 1;

    if (pathChunks[0] !== '') {
      throw new Error('Path must start with a /');
    }
    method = method.toUpperCase() as HttpMethod;
    
    let currentNode = this.root;
    let currentIndex = 0;

    pathChunks[0] = method;

    while (currentIndex < pathChunks.length) {
      const prefix = pathChunks[currentIndex];
      const child = currentNode.children ? currentNode.children.get(prefix) : undefined;
      const isLeaf = currentIndex === pathChunks.length - 1;
      const isParam = prefix.startsWith(':');
      const isWildcard = prefix === '*';
      const isRegex = prefix.startsWith('(') && prefix.endsWith(')');

      if (child && isLeaf) {
        throw new Error('Path already exists');
      }

      // Increment the current index
      currentIndex++;
    }
    
  }

  /* Helper Methods */
}