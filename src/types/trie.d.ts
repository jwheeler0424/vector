import type { HandlerFunction } from '@/types/handler';
import { HttpMethod } from './http';

export const enum NodeFlag {
  'STATIC', // '/example/users/add'
  'PARAM', // '/example/users/:id'
  'MULTIPARAM', // '/example/near/:lat-:lng/radius/:r'
  'OPTPARAM', // '/example/users/:id?'
  'NONPARAM', // '/example/users/name::verb' as 'example/users/name:verb'
  'REGEXP', // '/example/users/(^\\d+)'
  'PARAM_REGEXP', // '/example/image/:file(^\\d+).png'
  'MULTIPARAM_REGEXP', // '/example/user/:name-:id(^\\d+)'
  'MULTIPARAM_MULTIREGEXP', // '/example/at/:hour(^\\d+)h-:minute(^\\d+)m-:second(^\\d+)s'
  'WILDCARD', // '/example/*'
}

type RouterNode = {
  key: Char | null;
  label: string | null;
  size: number;
  parent: RouterNode | null;
  children: Map<Char, RouterNode> | null;

  isLeaf: boolean;

  nodeType: NodeFlag | null;
  methods: Record<HttpMethod, HandlerFunction> | null;
};

type MatchedRoute = {
  handler: HandlerFunction;
  params: Record<string, string>;
  route: string;
};

type Char =
  | ' '
  | '!'
  | '"'
  | '#'
  | '$'
  | '%'
  | '&'
  | "'"
  | '('
  | ')'
  | '*'
  | '+'
  | ','
  | '-'
  | '.'
  | '/'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | ':'
  | ';'
  | '<'
  | '='
  | '>'
  | '?'
  | '@'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
  | '['
  | '\\'
  | ']'
  | '^'
  | '_'
  | '`'
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'
  | '{'
  | '|'
  | '}'
  | '~'
  | 'À'
  | 'Á'
  | 'Â'
  | 'Ã'
  | 'Ä'
  | 'Å'
  | 'Æ'
  | 'Ç'
  | 'È'
  | 'É'
  | 'Ê'
  | 'Ë'
  | 'Ì'
  | 'Í'
  | 'Î'
  | 'Ï'
  | 'Ð'
  | 'Ñ'
  | 'Ò'
  | 'Ó'
  | 'Ô'
  | 'Õ'
  | 'Ö'
  | 'Ø'
  | 'Ù'
  | 'Ú'
  | 'Û'
  | 'Ü'
  | 'Ý'
  | 'Þ'
  | 'ß'
  | 'à'
  | 'á'
  | 'â'
  | 'ã'
  | 'ä'
  | 'å'
  | 'æ'
  | 'ç'
  | 'è'
  | 'é'
  | 'ê'
  | 'ë'
  | 'ì'
  | 'í'
  | 'î'
  | 'ï'
  | 'ð'
  | 'ñ'
  | 'ò'
  | 'ó'
  | 'ô'
  | 'õ'
  | 'ö'
  | '÷'
  | 'ø'
  | 'ù'
  | 'ú'
  | 'û'
  | 'ü'
  | 'ý'
  | 'þ'
  | 'ÿ';