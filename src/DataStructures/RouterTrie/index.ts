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
    if (path[0] !== '/') {
      throw new Error('Path must start with a /');
    }

    method = method.toUpperCase() as HttpMethod;
    const pathChunks = this.splitPath(path);

    
    let currentNode = this.root;
    let currentIndex = 0;

    pathChunks[0] = method;

    while (currentIndex < pathChunks.length) {
      const prefix = pathChunks[currentIndex];
      const child = currentNode.children ? currentNode.children.get(prefix) : undefined;
      const isLeaf = currentIndex === pathChunks.length - 1;

      // If the child exists and the node is a leaf, throw an error
      if (child && isLeaf) {
        throw new Error('Path already exists');
      }

      // If the child exists and the node is not a leaf, continue
      if (child && !isLeaf) {
        currentNode = child;
        continue;
      }

      // Check if the prefix is a param, wildcard, or regex
      const isParam = prefix.startsWith(':');
      const isWildcard = prefix === '*';
      const isRegex = prefix[0] === '/' ? this.isRegex(prefix) : false;

      // If the child does not exist, create a new node
      if (!child) {
        const newNode = new Node();
        newNode.prefix = isRegex ? prefix.slice(1, -1) : prefix;
        newNode.size = !isWildcard && !isParam ? prefix.length : 0;
        newNode.parent = currentNode;
        newNode.handler = isLeaf ? handler : null;
        newNode.isLeaf = isLeaf;
        newNode.isParam = isParam;
        newNode.isWildcard = isWildcard;
        newNode.isRegex = isRegex;

        if (!currentNode.children) {
          currentNode.children = new Map();
        }

        currentNode.children.set(prefix, newNode);
      }

  

      // Increment the current index
      currentIndex++;
    }
    
  }

  /* ============================================================================ */
  /*                                Helper Methods                                */
  /* ============================================================================ */

  /**
   * Split Path
   * ----------------------------------------------------------------------------
   * Split the path into an array of chunks.
   * 
   * @name splitPath
   * @description
   * This method splits the path into an array of chunks. The chunks are split by
   * the forward slash '/' character. The chunks are returned as an array. The 
   * time complixity of this method is O(n) where n is the length of the path.
   * 
   * @param {string} path - The path to split
   * @returns {string[]} - The array of path chunks
   * 
   * @example
   * const path = `/users/:id/:name/(/d+.* /)/ * /edit`;
   * const chunks = splitPath(path);
   * 
   * console.log(chunks);
   * // ['users', ':id', ':name', '/ d+.* /', '*', 'edit']
   */
  private splitPath(path: string): string[] {
    // TODO: Add support for trailing slashes
    const chunks: Array<string> = [];
    let index = 0;
    let chunk = '';
    // pFlag is a flag for parentheses
    let pFlag = false;

    while (index < path.length) {
      const char = path[index];

      // Check if the character is a parenthesis and set flag accordingly
      if (char === '(') {
        pFlag = true;
        index++;
        continue;
      } else if (char === ')') {
        pFlag = false;
        index++;
        continue;
      }

      // Check if the character is a slash and the first character of the path
      if (char === '/' && index === 0) {
        index++;
        continue;
      }

      // Check if the character is a slash and the parentheses flag is false
      if (char === '/' && !pFlag) {
        chunks.push(chunk);
        chunk = '';
        index++;
        continue;
      }

      // Add the character to the chunk
      chunk += char;

      index++;
    }

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    return chunks;
  }

  /**
   * Is Regex
   * ----------------------------------------------------------------------------
   * Check if the pattern is a regex pattern.
   * 
   * @name isRegex
   * @description
   * This method checks if the pattern is a regex pattern. The pattern is a regex
   * pattern if it starts with a forward slash '/' and ends with a forward slash
   * and optional flags '/igmysu'. The time complexity of this method is O(n) 
   * where n is the length of the pattern.
   * 
   * @param {string} pattern - The pattern to check
   * @returns {boolean} - Whether the pattern is a regex pattern
   * 
   * @example
   * const pattern = '/d+.* /';
   * 
   * console.log(isRegex(pattern));
   * // true
   */
  private isRegex(pattern: string): boolean {
    // Regex flags are i, g, m, u, s, and y (ignoreCase, global, multiline, unicode, dotAll, sticky)
    return pattern.match(/^\/.*\/[igmysu]*$/) !== null;
  }
}