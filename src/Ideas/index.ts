// Node Flags
//------------------------
// 0  0  0  0  0  0  0  0
//------------------------
// W  M  R  N  M  O  P  S
// I  U  E  O  U  P  A  T
// L  L  G  N  L  T  R  A
// D  T  E  P  T  P  A  T
// C  I  X  A  I  A  M  I
// A     P  R     R     C
// R        A     A      
// D        M     M

// 0 | 1 << 0 | STATIC          // 1
// 0 | 1 << 1 | PARAM           // 2
// 0 | 1 << 2 | OPT_PARAM       // 4
// 0 | 1 << 3 | MULTI_PARAM     // 8
// 0 | 1 << 4 | NON_PARAM       // 16
// 0 | 1 << 5 | REGEXP          // 32
// 0 | 1 << 6 | MULTI_REGEXP    // 64
// 0 | 1 << 7 | WILDCARD        // 128

export const NodeFlag = {
  STATIC: 1 << 0, // '/example/users/add'
  PARAM: 1 << 1, // '/example/users/:id'
  OPT_PARAM: 1 << 2, // '/example/users/:id?'
  MULTI_PARAM: 1 << 3, // '/example/near/:lat-:lng/radius/:r'
  NON_PARAM: 1 << 4, // '/example/users/name::verb' as 'example/users/name:verb'
  REGEXP: 1 << 5, // '/example/users/(^\\d+)'
  MULTI_REGEXP: 1 << 6, // '/example/image/:file(^\\d+).:ext(png | jpg | jpeg | gif)'
  WILDCARD: 1 << 7 // '/example/*'
} as const;

type NodeFlag = keyof typeof NodeFlag;

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
  const params: Array<Parameter> = [];

  let chunkValue = '';
  let nodeFlag = 0;
  let param: Parameter | null = null;
  let paramName = '';
  let paramValue = '';
  let paramFlag = false;
  let paramIndex = 0;
  let paramCount = 0;
  let regexpFlag = false;
  let regexpCount = 0;
  
  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (char !== '/') {
      chunkValue += char;

      // Check if currently defining parameter
      if (paramFlag) {
        // Check if valid parameter character
        if (!validParamChar(char, paramIndex)) {
          // ':' cannot be separating delimiter when defining parameters
          // e.g. '/example/:id:name' is invalid
          // e.g. '/example/:id::verb' is valid
          // two ':' in a row is valid as it will reduce to one ':' and nonparam
          // three ':' in a row is invalid as it will flag as param and then two ':' which reduces to one ':'
          // and a param cannot be defined with a ':' in the name
          if (char === ':' && path[i-1] !== ':') {
            if (path[i+1] === ':') {
              param = {
                name: paramName,
                value: null,
                optional: false
              }
              params.push(param);

              paramFlag = false;
              paramName = '';
              paramIndex = 0;
              continue;
            }

            throw new Error('Invalid path - There must be a separating delimiter between parameters');

          } else if (char === ':' && path[i-1] === ':') {
            if (path[i+1] === ':') {
              throw new Error('Invalid path - A parameter cannot be defined with a ":" in the name');
            }

            // If node is not already flagged for NON_PARAM, flag it
            if (!isFlag(nodeFlag, NodeFlag.NON_PARAM)) nodeFlag += NodeFlag.NON_PARAM;
            paramFlag = false;
            paramName = '';
            paramIndex = 0;
            if (paramCount > 0) {
              paramCount--;
            }
            if (paramCount < 2 && isFlag(nodeFlag, NodeFlag.MULTI_PARAM)) {
              nodeFlag -= NodeFlag.MULTI_PARAM;
            }
            if (paramCount < 1 && isFlag(nodeFlag, NodeFlag.PARAM)) {
              nodeFlag -= NodeFlag.PARAM;
            }
            continue;
          }

          // Must be a valid separator while defining parameters
          if (char !== '?' && char !== '-' && char !== '(') {
            throw new Error('Invalid path - A parameter name can only contain alphanumeric characters, underscores, and dollar signs');
          }

          // Create parameter object
          param = {
            name: paramName,
            value: null,
            optional: false
          }

          // Check if optional parameter
          if (char === '?') {
            if (isFlag(nodeFlag, NodeFlag.OPT_PARAM) || isFlag(nodeFlag, NodeFlag.MULTI_PARAM)) {
              throw new Error('Invalid path - A parameter cannot be optional and multiparam');
            }
            nodeFlag += NodeFlag.OPT_PARAM;
            param.optional = true;
          }

          // Check if parameter is followed by RegExp
          if (char === '(') {
            regexpFlag = true;
            paramValue += char;

            // Check if regexp is already defined and flag as multi regexp else flag as regexp
            if (isFlag(nodeFlag, NodeFlag.REGEXP)) {
              nodeFlag += NodeFlag.MULTI_REGEXP;
            } else {
              nodeFlag += NodeFlag.REGEXP;
            }
          }

          // Check if multiparam separator and push current param to array and reset param
          if (char === '-') {
            if (isFlag(nodeFlag, NodeFlag.OPT_PARAM)) {
              throw new Error('Invalid path - A parameter cannot be optional and multiparam');
            }
            params.push(param);
            param = null;
          }

          paramFlag = false;
          paramName = '';
          paramIndex = 0;
        } else {
          paramName += char;
          paramIndex++;
        }

        continue;
      }

      // Check if currently defining regexp
      if (regexpFlag) {}

      // Check for start of parameter definition
      if (char === ':') {
        paramFlag = true;
        paramName = '';
        paramIndex = 0;
        paramCount ++;

        // Check if optional parameter is already defined
        if (isFlag(nodeFlag, NodeFlag.OPT_PARAM)) {
          throw new Error('Invalid path - A parameter cannot be optional and multiparam');
        }

        // Check if param is already defined and flag as multiparam else flag as param
        if (isFlag(nodeFlag, NodeFlag.PARAM)) {
          nodeFlag += NodeFlag.MULTI_PARAM;
        } else {
          nodeFlag += NodeFlag.PARAM;
        }
      }

      continue;
    }
    
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
        const paramMap = new Map<string, Parameter>();
        const params = chunkValue.split('-');

        // check if optional param
        if (paramCount === 1 && chunkValue.endsWith('?')) {
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

        // check if multiparam
        if (paramCount > 1) {
          
          chunkValue.split('-').forEach((param) => {
            paramMap.set(param, {
              name: param.slice(1),
              value: null,
              optional: false
            });
          });
          nodeChunks.push({
            label: chunkValue,
            type: 'MULTIPARAM',
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

export const validParamChar = (char: string, index: number): boolean => {
  return index - 1 === 0 ? /[a-zA-Z_$]/.test(char) : /[a-zA-Z0-9_$]/.test(char);
}

export const isFlag = (byte: number, flag: number): boolean => {
  return (byte & flag) === flag;
}