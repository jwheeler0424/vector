import type { HandlerFunction } from '@/types/handler';
import { HttpMethod } from './http';
import { CharMap, NodeFlag } from '@/Maps';

type Char = keyof typeof CharMap;
type NodeFlag = (typeof NodeFlag)[keyof typeof NodeFlag];

type RouterNode = {
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
};

type MatchedRoute = {
  handler: HandlerFunction;
  params: Array<NamedParameter> | null;
  route: string;
};

type NamedParameter = {
  name: string;
  value: string;
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
