import { HandlerMap } from '@/types/handler';

/**
 * Router Node Data Structure
 * --------------------------------------------------------------------------------
 * @name RouterNode
 * @implements {RouterNodeInterface}
 * @description
 * This is the data and pointers for the router trie. Each node stores the prefix 
 * of the node, the parent node, the children of the node, the handlers, and the 
 * node flags (isLeaf, isRegex, isParam, isWildcard). The children map is a map 
 * where the key is the prefix of the child and the value is the child node. The 
 * handlers map is a map where the key is the method and the value is the handler 
 * function or boolean value to allow early search termination if the path does not 
 * contain the requested method.
 * 
 * @property {string | null} prefix - The prefix of the node
 * @property {number} size - The number of children of the node
 * @property {RouterNode | null} parent - The parent of the node
 * @property {ChildrenMap | null} children - The children of the node mapped by prefix
 * @property {HandlerMap | null} handlers - The handlers of the node mapped by method with a boolean value or handler function
 * @property {boolean} isLeaf - Whether the node is a leaf / end of a path
 * @property {boolean} isRegex - Whether the node is a regex pattern
 * @property {boolean} isParam - Whether the node is parametrized
 * @property {boolean} isWildcard - Whether the node is a wildcard
 * 
 * @example
 * const node = new RouterNode();
 */
export class RouterNode implements RouterNodeInterface {
  /* Router Node data */
  public prefix: string | null;
  public size: number;
  public parent: RouterNode | null;

  /* Router Node maps */
  public children: ChildrenMap | null;
  public handlers: HandlerMap | null;

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
    this.handlers = null;
    this.isLeaf = false;
    this.isRegex = false;
    this.isParam = false;
    this.isWildcard = false;
  }
}
