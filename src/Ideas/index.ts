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
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

type NodeFlag = IntRange<0, 256>
const valu: NodeFlag = 256;
if (valu) {
  console.log('yes');
}

// export const nodeFlag = {
//   STATIC: 1 << 0, // '/example/users/add'
//   PARAM: 1 << 1, // '/example/users/:id'
//   OPT_PARAM: 1 << 2, // '/example/users/:id?'
//   MULTI_PARAM: 1 << 3, // '/example/near/:lat-:lng/radius/:r'
//   NON_PARAM: 1 << 4, // '/example/users/name::verb' as 'example/users/name:verb'
//   REGEXP: 1 << 5, // '/example/users/(^\\d+)'
//   MULTI_REGEXP: 1 << 6, // '/example/image/:file(^\\d+).:ext(png | jpg | jpeg | gif)'
//   WILDCARD: 1 << 7 // '/example/*'
// } as const;

// type NodeFlag = keyof typeof nodeFlag;

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
  let param: Parameter | null = null;
  let paramName = '';
  let paramValue = '';
  let pFlag = false;
  let pIndex = 0;
  let pCount = 0;
  let rFlag = 0;
  let rCount = 0;
  
  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (char !== '/') {
      chunkValue += char;

      if (pFlag) {
        if (!validParamChar(char, pIndex)) {
          // ':' cannot be separating delimiter when defining parameters
          // e.g. '/example/:id:' is invalid
          // e.g. '/example/:id::verb' is valid
          // two ':' in a row is valid as it will reduce to one ':' and nonparam
          if (char === ':' && path[i-1] !== ':') {
            throw new Error('Invalid path - There must be a separating delimiter between parameters')
          } else if (char === ':' && path[i-1] === ':') {
            continue;
          }

          param = {
            name: paramName,
            value: null,
            optional: false
          }

          if (char === '?') {
            param.optional = true;
          }
          
          

          pFlag = false;
          paramName = '';
        } else {
          paramName += char;
          pIndex++;
        }
      }

      if (char === ':') {
        pFlag = true;
        pIndex = 0;
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

export const getType = (chunk: string): NodeFlag => {

}

export const validParamChar = (char: string, index: number): boolean => {
  return index - 1 === 0 ? /[a-zA-Z_$]/.test(char) : /[a-zA-Z0-9_$]/.test(char);
}