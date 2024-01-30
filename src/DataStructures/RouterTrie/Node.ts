import type { NodeFlag, Parameter, RouterNode } from '@/types/trie';
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
 * const preset = {
 *  key: 'a',
 *  label: 'amber',
 *  size: 5,
 * }
 * 
 * const node = new Node(preset);
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
 * @property {string | null} label - The label of the node
 * @property {RouterNode | null} parent - The parent of the node
 * 
 * @property {Array<RouterNode> | null} children - The children of the node mapped by prefix
 * @property {Record<HttpMethod, HandlerFunction> | null} methods - The methods map of the node
 * 
 * @property {boolean} isLeaf - Whether the node is a leaf / end of a path
 * @property {NodeFlag | null} type - The node type of the node
 * 
 * @property {string | null} path - The url path stored in the leaf node
 * @property {Array<Parameter> | null} params - The params stored in the leaf node
 */
export class Node implements RouterNode {
  /* Router Node data */
  label: string | null;
  parent: RouterNode | null;

  /* Router Node maps */
  children: Array<RouterNode> | null;
  methods: Map<HttpMethod, HandlerFunction> | null;

  /* Router Node flags */
  type: NodeFlag | null;
  isLeaf: boolean;

  /* Router Node Leaf Data */
  path: string | null;
  params: Array<Parameter> | null;

  constructor(node?: Partial<RouterNode>) {
    this.label = node?.label ?? null;
    this.parent = node?.parent ?? null;
    this.children = node?.children ?? null;
    this.isLeaf = node?.isLeaf ?? false;
    this.type = node?.type ?? null;
    this.methods = node?.methods ?? null;
    this.path = node?.path ?? null;
    this.params = node?.params ?? null;
  }
}
