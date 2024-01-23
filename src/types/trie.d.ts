import type { HandlerFunction } from '@/types/handler';

type RouterNode = {
  prefix: string | null;
  size: number;
  parent: RouterNode | null;
  handler: HandlerFunction | null;

  children: Map<string, RouterNode> | null;

  isLeaf: boolean;
  isRegex: boolean;
  isParam: boolean;
  isWildcard: boolean;
};

type ChildrenMap = Map<string, RouterNode>;

type MatchedRoute = {
  handler: HandlerFunction;
  matched: string[];
  route: string[];
};