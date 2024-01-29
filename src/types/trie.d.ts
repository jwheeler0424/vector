import type { HandlerFunction } from '@/types/handler';
import { HttpMethod } from './http';
import { CharMap, NodeFlag } from '@/Maps';

type Char = keyof typeof CharMap;
type NodeFlag = (typeof NodeFlag)[keyof typeof NodeFlag];

type RouterNode = {
  key: Char | null;
  label: string | null;
  size: number;
  parent: RouterNode | null;
  children: Map<Char, RouterNode> | null;

  isLeaf: boolean;

  nodeType: NodeFlag | null;
  methods: Record<HttpMethod, HandlerFunction> | null;

  path: string | null;
  params: Record<string, {
    value: string | null,
    optional: boolean,
  }> | null;
};

type MatchedRoute = {
  handler: HandlerFunction;
  params: Record<string, string | undefined>;
  route: string;
};

type Parameter = {
  name: string | null;
  value: string | null;
  optional: boolean;
  regexp: RegExp | null;
};

type NodeChunk = {
  label: string;
  type: NodeFlag;
  params: Array<Parameter> | null;
};