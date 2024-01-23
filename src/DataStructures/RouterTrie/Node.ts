import type { ChildrenMap, RouterNode } from '@/types/trie';
import type { HandlerFunction } from '@/types/handler';

/**
 * Router Node Structure
 * --------------------------------------------------------------------------------
 * @name Node
 * @implements {RouterNode}
 * 
 * @example
 * const node = new Node();
 * 
 * @description
 * This is the data and pointers for the router trie. Each node stores the prefix 
 * of the node, the parent node, the children of the node, the handler function, 
 * and the node flags (isLeaf, isRegex, isParam, isWildcard). The children map is a 
 * map where the key is the prefix of the child and the value is the child node. 
 * The handler function is a function definition which determines the interaction
 * of the http request.
 * 
 * @property {string | null} prefix - The prefix of the node
 * @property {number} size - The number of children of the node
 * @property {RouterNode | null} parent - The parent of the node
 * @property {HandlerFunction | null} handler - The handler function of the node
 * @property {ChildrenMap | null} children - The children of the node mapped by prefix
 * @property {boolean} isLeaf - Whether the node is a leaf / end of a path
 * @property {boolean} isRegex - Whether the node is a regex pattern
 * @property {boolean} isParam - Whether the node is parametrized
 * @property {boolean} isWildcard - Whether the node is a wildcard
 */
export class Node implements RouterNode {
  /* Router Node data */
  public prefix: string | null;
  public size: number;
  public parent: RouterNode | null;
  public handler: HandlerFunction | null;

  /* Router Node maps */
  public children: ChildrenMap | null;

  /* Router Node flags */
  public isLeaf: boolean;
  public isRegex: boolean;
  public isParam: boolean;
  public isWildcard: boolean;

  constructor() {
    this.prefix = null;
    this.size = 0;
    this.parent = null;
    this.children = null;
    this.handler = null;
    this.isLeaf = false;
    this.isRegex = false;
    this.isParam = false;
    this.isWildcard = false;
  }
}
