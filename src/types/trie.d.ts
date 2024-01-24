import type { HandlerFunction } from '@/types/handler';
import { HttpMethod } from './http';

export const enum NodeFlag {
  'STATIC',                   // '/example/users/add'
  'PARAM',                    // '/example/users/:id'
  'MULTIPARAM',               // '/example/near/:lat-:lng/radius/:r'
  'OPTPARAM',                 // '/example/users/:id?'
  'NONPARAM',                 // '/example/users/name::verb' as 'example/users/name:verb'
  'REGEXP',                   // '/example/users/(^\\d+)'
  'PARAM_REGEXP',             // '/example/image/:file(^\\d+).png'
  'MULTIPARAM_REGEXP',        // '/example/user/:name-:id(^\\d+)'
  'MULTIPARAM_MULTIREGEXP',   // '/example/at/:hour(^\\d+)h-:minute(^\\d+)m-:second(^\\d+)s'
  'WILDCARD',                 // '/example/*'
};

type RouterNode = {
  key: string | null;
  label: string | null;
  size: number;
  parent: RouterNode | null;
  children: Map<string, RouterNode> | null;

  isLeaf: boolean;
  
  nodeType: NodeFlag;
  methods: Record<HttpMethod, HandlerFunction | null>;
};

type ChildrenMap = Map<string, RouterNode>;

type MatchedRoute = {
  handler: HandlerFunction;
  params: Record<string, string>;
  route: string;
};