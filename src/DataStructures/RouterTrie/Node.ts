import type { Char, NodeFlag, RouterNode } from '@/types/trie';
import type { HandlerFunction } from '@/types/handler';
import type { HttpMethod } from '@/types/http';

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
 * This is the data and pointers for the router trie. Each node stores the key of
 * the node, the label of the node, the size of the label, the parent node, the 
 * children of the node, the methods map which points to the handler functions, 
 * and the node flags (isLeaf and nodeType). The children map is a map where the key 
 * is the first character of the label and the value is the child node. The handler 
 * functions stored in the methods are function definitions which determine the 
 * interactions of the http requests.
 * 
 * @property {Char | null} key - The key of the node
 * @property {string | null} label - The label of the node
 * @property {number} size - The size of characters in the label
 * @property {RouterNode | null} parent - The parent of the node
 * 
 * @property {Map<Char, RouterNode> | null} children - The children of the node mapped by prefix
 * @property {Record<HttpMethod, HandlerFunction> | null} methods - The methods map of the node
 * 
 * @property {boolean} isLeaf - Whether the node is a leaf / end of a path
 * @property {NodeFlag | null} nodeType - The node type of the node
 */
export class Node implements RouterNode {
  /* Router Node data */
  key: Char | null;
  label: string | null;
  size: number;
  parent: RouterNode | null;

  /* Router Node maps */
  children: Map<Char, RouterNode> | null;
  methods: Record<HttpMethod, HandlerFunction> | null;

  /* Router Node flags */
  isLeaf: boolean;
  nodeType: NodeFlag | null;

  constructor() {
    this.key = null;
    this.label = null;
    this.size = 0;
    this.parent = null;
    this.children = null;
    this.isLeaf = false;
    this.nodeType = null;
    this.methods = null;
  }
}
