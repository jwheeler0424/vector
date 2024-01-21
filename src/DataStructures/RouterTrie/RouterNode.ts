export type HandlerFunction = (...args: unknown[]) => void;

type RouterNodeInterface = {
  prefix: string;
  size: number;
  parent: RouterNode | null;
  children: Map<string, RouterNode>;
  handler: HandlerFunction | null;

  isLeaf: boolean;
  isRegex: boolean;
  isParam: boolean;
  isWildcard: boolean;
};

export class RouterNode implements RouterNodeInterface {
  /* Router Node data */
  public prefix: string;
  public size: number;
  public parent: RouterNode | null;
  public children: Map<string, RouterNode>;
  public handler: HandlerFunction | null;

  /* Router Node flags */
  public isLeaf: boolean;
  public isRegex: boolean;
  public isParam: boolean;
  public isWildcard: boolean;

  constructor(
    prefix?: string,
    parent?: RouterNode,
    handler?: HandlerFunction,
    isLeaf?: boolean,
    isRegex?: boolean,
    isParam?: boolean,
    isWildcard?: boolean,
  ) {
    this.prefix = prefix || '';
    this.size = prefix ? prefix.length : 0;
    this.parent = parent || null;
    this.children = new Map();
    this.handler = handler || null;

    this.isLeaf = !!isLeaf;
    this.isRegex = !!isRegex;
    this.isParam = !!isParam;
    this.isWildcard = !!isWildcard;
  }
}
