type RouterNodeInterface = {
  prefix: string | null;
  size: number;
  parent: RouterNode | null;
  children: Map<string, RouterNode> | null;
  handlers: HandlerMap | null;

  isLeaf: boolean;
  isRegex: boolean;
  isParam: boolean;
  isWildcard: boolean;
};

type ChildrenMap = Map<string, RouterNode>;