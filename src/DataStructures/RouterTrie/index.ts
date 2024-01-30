// import type { HandlerFunction } from '@/types/handler';
// import { type UCaseHttpMethod, Methods } from '@/types/http';
import type { RouterNode } from '@/types/trie';
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
 */

export type RouterTrie = {
  // insert(path: string, method: UCaseHttpMethod, handler: HandlerFunction): void;
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
   * This method inserts a path into the trie. The path is traversed and each
   * forward slash '/' starts a new node branch.
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
  // insert(
  //   path: string,
  //   method: UCaseHttpMethod,
  //   handler: HandlerFunction,
  // ): void {
  //   if (path[0] !== '/') {
  //     throw new Error('Path must start with a /');
  //   }

  //   if (!Methods[method]) {
  //     throw new Error('Invalid http method - Method not supported');
  //   }

  //   let currentNode = this.root;
  //   let pathIndex = 0;
  //   let labelIndex = 0;
  //   let pathDepth = 0;
  //   let currentChunk = '';
  //   let paramName = '';
  //   let paramOptional = false;
  //   let paramFlag = false;
  //   let regexpFlag = false;

  //   while (pathIndex < path.length) {
  //     const key = path[pathIndex] as Char;
  //     const isLastChar = pathIndex === path.length - 1;
  //     const isForwardSlash = key === '/';
  //     const isParamDelimiter = key === ':';
  //     const isRegExpOpenDelimiter = key === '(';

  //     // currentChunk += key;

  //     const child = currentNode.children
  //       ? currentNode.children.get(key)
  //       : undefined;

  //     // If the child exists and the key is a forward slash, reset the current chunk,
  //     // update the current node and increment the current index then continue the loop
  //     if (child && isForwardSlash) {
  //       currentChunk = '';
  //       labelIndex = 0;
  //       paramName = '';
  //       paramOptional = false;
  //       pathIndex++;
  //       if (!isLastChar) {
  //         // TODO: add support for trailing slashes
  //         currentNode = child;
  //         pathDepth++;
  //       }
  //       continue;
  //     }

  //     // If the child exists and the key is a param delimiter, check if the param matches
  //     // the node params
  //     if (child && isParamDelimiter) {
  //       // Reset the label index, param name, and param optional
  //       labelIndex = 0;
  //       paramName = '';
  //       paramOptional = false;

  //       // Check if the param delimiter is the last character
  //       if (isLastChar) {
  //         throw new Error(
  //           'Invalid path - Parameter delimiter cannot be last character',
  //         );
  //       }

  //       // Check if the label is null
  //       const label = child.label;
  //       if (label === null) {
  //         throw new Error(
  //           'Invalid path - Path node label must be given some value',
  //         );
  //       }

  //       // Check if the param delimiter is followed by a separating delimiter
  //       const nextChar: Char | undefined = path[pathIndex + 1] as
  //         | Char
  //         | undefined;
  //       if (
  //         !nextChar ||
  //         nextChar === '/' ||
  //         nextChar === '(' ||
  //         nextChar === '-'
  //       ) {
  //         throw new Error('Invalid path - Parameter must be given a name');
  //       }

  //       // Check if the param delimiter is followed by another param delimiter
  //       if (nextChar === ':') {
  //         pathIndex++;
  //         continue;
  //       }

  //       // Compare the label and the path to check for param match
  //       while (labelIndex < label.length && pathIndex < path.length) {
  //         // Check if the param delimiter is followed by a separating delimiter
  //         if (labelIndex > 0 && path[pathIndex + labelIndex] === ':') {
  //           throw new Error(
  //             'Invalid path - There must be a separating delimiter between parameters',
  //           );
  //         }

  //         // Check if separating delimiter is reached
  //         if (
  //           path[pathIndex + labelIndex] === '/' ||
  //           path[pathIndex + labelIndex] === '(' ||
  //           path[pathIndex + labelIndex] === '-'
  //         )
  //           break;

  //         // Check if the parameter is optional and use as separator
  //         if (path[pathIndex + labelIndex] === '?') {
  //           paramOptional = true;
  //           break;
  //         }

  //         // Check if the label and the path mismatch
  //         if (label[labelIndex] !== path[pathIndex + labelIndex]) {
  //           throw new Error(
  //             'Invalid path - There are conflicting path parameters',
  //           );
  //         }

  //         if (path[pathIndex + labelIndex] !== ':')
  //           paramName += path[pathIndex + labelIndex];

  //         labelIndex++;
  //       }

  //       // Check if the param match completely matched the label
  //       if (
  //         (child.params && !child.params[paramName]) ||
  //         (child.params &&
  //           child.params[paramName] &&
  //           child.params[paramName].optional !== paramOptional)
  //       ) {
  //         throw new Error(
  //           'Invalid path - There are conflicting path parameters',
  //         );
  //       }

  //       // If the param match completely matched the label, update the current node
  //       // and increment the current index then continue the loop
  //       pathDepth++;
  //       currentNode = child;
  //       pathIndex += labelIndex - 1;
  //     }

  //     if (child && isRegExpOpenDelimiter) {
  //       // Check if the regexp delimiter is the last character
  //       if (isLastChar) {
  //         throw new Error(
  //           'Invalid path - Regular expression delimiter cannot be last character',
  //         );
  //       }

  //       // Check if the label is null
  //       const label = child.label;
  //       if (label === null) {
  //         throw new Error(
  //           'Invalid path - Path node label must be given some value',
  //         );
  //       }

  //       // Compare the label and the path to check for regexp match
  //       while (labelIndex < label.length && pathIndex < path.length) {
  //         // Check if closing regexp delimiter is reached
  //         if (path[pathIndex + labelIndex] === ')') break;

  //         // Check if the label and the path mismatch
  //         if (label[labelIndex] !== path[pathIndex + labelIndex]) break;

  //         labelIndex++;
  //       }

  //       // Check if the regexp match completely matched the label
  //       if (child.params && !child.params[paramName]) {
  //         throw new Error(
  //           'Invalid path - There are conflicting path regular expressions',
  //         );
  //       }

  //       // If the regexp match completely matched the label, update the current node
  //       // and increment the current index then continue the loop
  //       pathDepth++;
  //       currentNode = child;
  //       pathIndex += labelIndex - 1;

  //       // Reset the label index, param name, and param optional
  //       if (labelIndex === label.length) labelIndex = 0;
  //       paramName = '';
  //       paramOptional = false;
  //     }

  //     // // If the child exists and the node is not a leaf, update the current node
  //     // // and increment the current index then continue the loop
  //     // if (child && !isLeaf) {
  //     //   currentNode = child;
  //     //   currentIndex++;
  //     //   continue;
  //     // }

  //     // // Check if the prefix is parameterized, a wildcard, or regex
  //     // const isParam = prefix[0] === ':';
  //     // const isWildcard = prefix === '*';
  //     // const isRegex = prefix[0] === '/' ? this.isRegex(prefix) : false;

  //     // // If the child does not exist, create a new node
  //     // const newNode = new Node();
  //     // newNode.prefix = prefix;
  //     // newNode.size = !isWildcard && !isParam && !isRegex ? prefix.length : 0;
  //     // newNode.parent = currentNode;
  //     // newNode.handler = isLeaf ? handler : null;
  //     // newNode.isLeaf = isLeaf;
  //     // newNode.isParam = isParam;
  //     // newNode.isWildcard = isWildcard;
  //     // newNode.isRegex = isRegex;

  //     // // If the current node does not have children, create a new map
  //     // if (!currentNode.children) {
  //     //   currentNode.children = new Map();
  //     // }

  //     // currentNode.children.set(prefix, newNode);

  //     // // If the node is a leaf, break the loop
  //     // if (isLeaf) {
  //     //   break;
  //     // }

  //     // Update the current node and increment the current index
  //     // currentNode = newNode;
  //     pathIndex++;
  //   }

  //   // Update the depth of the trie
  //   this.depth = Math.max(this.depth, pathDepth);

  //   return;
  // }

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
}
