export const Methods = {
  DELETE: 'DELETE',
  GET: 'GET',
  HEAD: 'HEAD',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
  OPTIONS: 'OPTIONS',
  PROPFIND: 'PROPFIND',
  PROPPATCH: 'PROPPATCH',
  MKCOL: 'MKCOL',
  COPY: 'COPY',
  MOVE: 'MOVE',
  LOCK: 'LOCK',
  UNLOCK: 'UNLOCK',
  TRACE: 'TRACE',
  SEARCH: 'SEARCH',
} as const;

type UCaseHttpMethod = Uppercase<typeof Methods[keyof typeof Methods]>;

type LCaseHttpMethod = Lowercase<typeof Methods[keyof typeof Methods]>;

type HttpMethod = UCaseHttpMethod | LCaseHttpMethod;
