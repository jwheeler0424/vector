// import type { HandlerFunction } from '@/types/handler';
// import { type UCaseHttpMethod, Methods } from '@/types/http';
import type { MatchedRoute, RouterNode } from '@/types/trie';
import { Node } from './Node';
import type { UCaseHttpMethod } from '@/types/http';
import type { HandlerFunction } from '@/types/handler';
import { Methods } from '@/Maps';
import { InvalidPathError } from '@/Errors';

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
  insert(path: string, method: UCaseHttpMethod, handler: HandlerFunction): void;
  match(path: string, method: UCaseHttpMethod): MatchedRoute | false;
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
  insert(
    path: string,
    method: UCaseHttpMethod,
    handler: HandlerFunction,
  ): void {
    if (path[0] !== '/' && path[0] !== '*') {
      throw new InvalidPathError("Invalid Path - Path must start with a '/' or be a wildcard '*'");
    }

    if (!Methods[method]) {
      throw new InvalidPathError('Method not supported');
    }

    if (!handler) {
      throw new InvalidPathError('Handler not provided');
    }

    // let currentNode = this.root;
    // let pathIndex = 0;
    // let labelIndex = 0;
    // let pathDepth = 0;

    // // Update the depth of the trie
    // this.depth = Math.max(this.depth, pathDepth);

    return;
  }

  match(path: string, method: UCaseHttpMethod): MatchedRoute | false {
    if (path[0] !== '/') {
      throw new InvalidPathError('Path must start with a /');
    }

    // Set default method to 'GET' if no method is provided
    if (!method) {
      method = 'GET';
    }

    if (!Methods[method]) {
      throw new InvalidPathError('Method not supported');
    }

    // const pathChunks = this.splitPath(path);

  
    return false;
  }

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
