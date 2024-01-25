export const nodeFlag = {
  STATIC: 'STATIC', // '/example/users/add'
  PARAM: 'PARAM', // '/example/users/:id'
  MULTIPARAM: 'MULTIPARAM', // '/example/near/:lat-:lng/radius/:r'
  OPTPARAM: 'OPTPARAM', // '/example/users/:id?'
  NONPARAM: 'NONPARAM', // '/example/users/name::verb' as 'example/users/name:verb'
  REGEXP: 'REGEXP', // '/example/users/(^\\d+)'
  PARAM_REGEXP: 'PARAM_REGEXP', // '/example/image/:file(^\\d+).png'
  MULTIPARAM_REGEXP: 'MULTIPARAM_REGEXP', // '/example/user/:name-:id(^\\d+)'
  MULTIPARAM_MULTIREGEXP: 'MULTIPARAM_MULTIREGEXP', // '/example/at/:hour(^\\d+)h-:minute(^\\d+)m-:second(^\\d+)s'
  WILDCARD: 'WILDCARD' // '/example/*'
} as const;

type NodeFlag = keyof typeof nodeFlag;

type Parameter = {
  name: string,
  value: string | null,
  optional: boolean
}

type NodeChunk = {
  label: string,
  type: NodeFlag,
  params: Map<string, Parameter> | null
}

export const parsePath = (path: string): Array<NodeChunk> => {
  const nodeChunks: Array<NodeChunk> = [];

  let chunkIndex = 0;
  let chunkValue = '';
  let paramCount = 0;
  let regexpCount = 0;
  let isNonParam = false;
  
  for (let i = 0; i < path.length; i++) {
    const char = path[i];
    
    if (char === '/') {
      // If first character value
      if (i === 0) {
        // if path.length === 1, then static root path
        if (path.length === 1) {
          nodeChunks.push({
            label: '',
            type: 'STATIC',
            params: null
          });
          return nodeChunks;
        }

        // otherwise continue to first chunk
        continue;
      }

      // If no params and no regexps
      if (paramCount === 0 && regexpCount === 0) {
        // check if wildcard
        if (chunkValue === '*') {
          nodeChunks.push({
            label: chunkValue,
            type: 'WILDCARD',
            params: null
          });
          continue;
        }

        // check if nonparam
        if (isNonParam) {
          nodeChunks.push({
            label: chunkValue,
            type: 'NONPARAM',
            params: null
          });
          continue;
        }

        // otherwise static
        nodeChunks.push({
          label: chunkValue,
          type: 'STATIC',
          params: null
        });
      }

      // If params and no regexps
      if (paramCount > 0 && regexpCount === 0) {
        // check if optional param
        if (paramCount === 1 && chunkValue.endsWith('?')) {
          const paramMap = new Map<string, Parameter>();
          paramMap.set(chunkValue, {
            name: chunkValue.slice(1, -1),
            value: null,
            optional: true
          });
          nodeChunks.push({
            label: chunkValue,
            type: 'OPTPARAM',
            params: paramMap
          });
          continue;
        }

        // otherwise param
        nodeChunks.push({
          label: chunkValue,
          type: 'PARAM',
          params: null
        });
      }

      // Clear indices and counts
      chunkIndex = 0;
      chunkValue = '';
      paramCount = 0;
      regexpCount = 0;
    }
  }

  return nodeChunks;
}

export const getType = (chunk: string): NodeFlag => {

}

export const validParamChar = (char: string, index: number): boolean => {
  return index - 1 === 0 ? /[a-zA-Z_$]/.test(char) : /[a-zA-Z0-9_$]/.test(char);
}