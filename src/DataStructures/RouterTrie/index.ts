import type { HandlerFunction } from '@/types/handler';
import { type UCaseHttpMethod, Methods } from '@/types/http';
import type { MatchedRoute, RouterNode } from '@/types/trie';
import { Node } from './Node';

/**
 * RouterTrie
 * ------------------------------------------------------------------------------
 * A router trie is a data structure used to store and retrieve routes. The trie
 * is a tree-like data structure that stores routes as nodes. The trie is a
 * prefix tree, meaning that each node in the trie represents a prefix of the
 * path. The trie is a compact data structure that allows for fast lookups.
 *
 * When inserting a route, the trie will throw an error if the route
 * already exists. The trie does not support duplicate routes. The trie will
 * throw an error if the path does not start with a forward slash '/'. The trie
 * will throw an error if the http method is not supported. The trie supports
 * the following http methods: GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.
 *
 * When matching a route, the trie will return an object with the handler
 * function and the matching route chunks. The trie will return false if the
 * route does not exist. The trie will throw an error if the path does not start
 * with a forward slash '/'. The trie will throw an error if the http method is
 * not supported. The trie supports the following http methods: GET, POST, PUT,
 * PATCH, DELETE, HEAD, and OPTIONS. The matching method will follow a resolve
 * precedence. The trie will first try to match the exact path. If the exact
 * path does not exist, the trie will try to match a parameterized path. If the
 * parameterized path does not exist, the trie will try to match a regex path.
 * If the regex path does not exist, the trie will try to match a wildcard path.
 * If the wildcard path does not exist, the trie will return false.
 * 
 * TODO: Add support for param + regex in same prefix
 *       ex - '/example/:file(^\\d+).png'
 * 
 *       Add support for multiple params in same prefix
 *       ex - '/example/near/:lat-:lng/radius/:r'
 * 
 *       Add support for multiple param + multiple regex in same prefix
 *       ex - '/example/at/:hour(^\\d{2})h:minute(^\\d{2})m'
 * 
 *       Add support for optional params
 *       ex - '/example/posts/:id?'
 * 
 *       Add support for ':' in path without declaring param, use '::' instead
 *       ex - '/name::verb' should be interpreted as /name:verb
 */

export type RouterTrie = {
  insert(path: string, method: UCaseHttpMethod, handler: HandlerFunction): void;
  // match(path: string, method?: UCaseHttpMethod): MatchedRoute | false;
  // depricated(path: string, method?: UCaseHttpMethod): void;
  // remove(key: string | string[]): void;
  // contains(key: string | string[]): boolean;
  // startsWith(prefix: string): Promise<Array<string>>;
  reset(): void;
  // display(): void;
  // toObject(): Record<string, unknown>
  // toString(): string;
  getDepth(): number;
};

export default class Trie implements RouterTrie {
  private root: RouterNode;
  private depth: number;

  constructor() {
    this.root = new Node();
    this.depth = 0;
  }

  /**
   * RouterTrie - Insert
   * ----------------------------------------------------------------------------
   * Insert a path into the trie.
   *
   * @name insert
   * @description
   * This method inserts a path into the trie. The path is inserted as an array
   * of chunks. The chunks are split by the forward slash '/' character. The time
   * complexity of this method is O(n) where n is the length of the path.
   *
   * @example
   * const trie = new Trie();
   *
   * trie.insert('/users/:id', 'GET', () => {});
   * trie.insert('/users/:id/:name', 'GET', () => {});
   * trie.insert('/users/:id/:name/edit', 'GET', () => {});
   *
   * @param {string} path - The url path to insert
   * @param {UCaseHttpMethod} method - The http method to insert
   * @param {HandlerFunction} handler - The handler function to insert
   * @returns {void}
   */
  insert(
    path: string,
    method: UCaseHttpMethod,
    handler: HandlerFunction,
  ): void {
    if (path[0] !== '/') {
      throw new Error('Path must start with a /');
    }

    if (!Methods[method]) {
      throw new Error('Invalid http method - Method not supported');
    }

    const pathChunks = this.splitPath(path);

    let currentNode = this.root;
    let currentIndex = 0;

    pathChunks[0] = method;

    while (currentIndex < pathChunks.length) {
      const prefix = pathChunks[currentIndex];
      const child = currentNode.children
        ? currentNode.children.get(prefix)
        : undefined;
      const isLeaf = currentIndex === pathChunks.length - 1;

      // If the child exists and the node is a leaf, throw an error
      if (child && isLeaf) {
        throw new Error('Path already exists');
      }

      // If the child exists and the node is not a leaf, update the current node
      // and increment the current index then continue the loop
      if (child && !isLeaf) {
        currentNode = child;
        currentIndex++;
        continue;
      }

      // Check if the prefix is parameterized, a wildcard, or regex
      const isParam = prefix[0] === ':';
      const isWildcard = prefix === '*';
      const isRegex = prefix[0] === '/' ? this.isRegex(prefix) : false;

      // If the child does not exist, create a new node
      const newNode = new Node();
      newNode.prefix = prefix;
      newNode.size = !isWildcard && !isParam && !isRegex ? prefix.length : 0;
      newNode.parent = currentNode;
      newNode.handler = isLeaf ? handler : null;
      newNode.isLeaf = isLeaf;
      newNode.isParam = isParam;
      newNode.isWildcard = isWildcard;
      newNode.isRegex = isRegex;

      // If the current node does not have children, create a new map
      if (!currentNode.children) {
        currentNode.children = new Map();
      }

      currentNode.children.set(prefix, newNode);

      // If the node is a leaf, break the loop
      if (isLeaf) {
        break;
      }

      // Update the current node and increment the current index
      currentNode = newNode;
      currentIndex++;
    }

    // Update the depth of the trie
    this.depth = Math.max(this.depth, pathChunks.length);

    return;
  }

  // match(path: string, method?: UCaseHttpMethod): MatchedRoute | false {
  //   if (path[0] !== '/') {
  //     throw new Error('Path must start with a /');
  //   }

  //   // Set default method to 'GET' if no method is provided
  //   if (!method) {
  //     method = 'GET';
  //   }

  //   if (!Methods[method]) {
  //     throw new Error('Invalid http method - Method not supported');
  //   }

  //   const pathChunks = this.splitPath(path);

  //   const matchedRoute: string[] = [];
  //   let currentNode = this.root;
  //   let currentIndex = 0;

  //   pathChunks[0] = method;

  //   while (currentIndex < pathChunks.length) {
  //     if (!currentNode.children) {
  //       return false;
  //     }

  //     const prefix = pathChunks[currentIndex];
  //     const child = currentNode.children.get(prefix);

  //     // If the child exists, check if the child is a leaf
  //     // If the child is a leaf, return the MatchedRoute object
  //     // If the child is not a leaf, update the current node and increment the
  //     // current index then continue the loop
  //     if (child) {
  //       matchedRoute.push(prefix);

  //       if (child.isLeaf) {
  //         return {
  //           handler: child.handler as HandlerFunction,
  //           matched: matchedRoute,
  //           route: pathChunks,
  //         };
  //       }

  //       currentNode = child;
  //       currentIndex++;
  //       continue;
  //     }

  //     // Loop through children to check for parameterized children, regex 
  //     // children, and wildcard children
  //     for (const [key, value] of currentNode.children) {
  //       // Check if the child is parameterized
  //       if (value.isParam) {
  //         matchedRoute.push(key);

  //         if (value.isLeaf) {
  //           return {
  //             handler: value.handler as HandlerFunction,
  //             matched: matchedRoute,
  //             route: pathChunks,
  //           };
  //         }

  //         currentNode = value;
  //         currentIndex++;
  //         break;
  //       }

  //       // Check if the child is a regex
  //       if (value.isRegex) {
  //         matchedRoute.push(key);

  //         if (value.isLeaf) {
  //           return {
  //             handler: value.handler as HandlerFunction,
  //             matched: matchedRoute,
  //             route: pathChunks,
  //           };
  //         }

  //         currentNode = value;
  //         currentIndex++;
  //         break;
  //       }

  //       // Check if the child is a wildcard
  //       if (value.isWildcard) {
  //         matchedRoute.push(key);

  //         if (value.isLeaf) {
  //           return {
  //             handler: value.handler as HandlerFunction,
  //             matched: matchedRoute,
  //             route: pathChunks,
  //           };
  //         }

  //         currentNode = value;
  //         currentIndex++;
  //         break;
  //       }
  //     }
  //   }

  //   return false;
  // }

  /**
   * RouterTrie - Reset
   * ----------------------------------------------------------------------------
   * Reset the trie.
   *
   * @name reset
   * @description
   * This method resets the trie. The time complexity of this method is O(1).
   *
   * @example
   * const trie = new Trie();
   *
   * trie.insert('/users/:id', 'GET', () => {});
   * trie.insert('/users/:id/:name', 'GET', () => {});
   * trie.insert('/users/:id/:name/edit', 'GET', () => {});
   *
   * trie.reset();
   *
   * @returns {void}
   */
  reset(): void {
    this.root = new Node();
    this.depth = 0;
  }

  /**
   * RouterTrie - Get Depth
   * ----------------------------------------------------------------------------
   * Get the depth of the trie.
   *
   * @name getDepth
   * @description
   * This method returns the depth of the trie. The depth of the trie is the
   * length of the longest path in the trie. The time complexity of this method
   * is O(1).
   *
   * @example
   * const trie = new Trie();
   *
   * trie.insert('/users/:id', 'GET', () => {});
   * trie.insert('/users/:id/:name', 'GET', () => {});
   * trie.insert('/users/:id/:name/edit', 'GET', () => {});
   *
   * console.log(trie.getDepth());
   * // 4
   *
   * @returns {number} The depth of the trie
   */
  getDepth(): number {
    return this.depth;
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
   * @returns {string[]} The array of path chunks
   *
   * @example
   * const path = `/users/:id/:name/(/d+.* /)/ * /edit`;
   * const chunks = splitPath(path);
   *
   * console.log(chunks);
   * // ['','users', ':id', ':name', '/ d+.* /', '*', 'edit']
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
      // if (char === '/' && index === 0) {
      //   index++;
      //   continue;
      // }

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
   * Is Regular Expression
   * ----------------------------------------------------------------------------
   * Check if the pattern is a regular expression pattern.
   *
   * @name isRegExp
   * @description
   * This method checks if the pattern is a regular expression pattern. The 
   * pattern is a regular expression pattern if it starts with an open 
   * parentheses '(' and ends with a closing parentheses ')'. The time complexity 
   * of this method is O(n) where n is the length of the pattern.
   *
   * @param {string} pattern - The pattern to check
   * @returns {boolean} Whether the pattern is a regular expression pattern
   *
   * @example
   * const pattern = '(d+.*)';
   *
   * console.log(isRegExp(pattern));
   * // true
   */
  private isRegExp(pattern: string): boolean {
    // Regex flags are i, g, m, u, s, and y (ignoreCase, global, multiline, unicode, dotAll, sticky)
    return pattern.match(/^\(.+\)/) !== null;
  }
}
