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

// TODO: create regexp array for regexp(s) with regexp objects
// determine if regexp is value for param or by itself
const exp = '(^\\d+)';
const regex = new RegExp(exp);
console.log(regex.test('a'));

/**
 * EXAMPLES:
 * ------------------------------------------
 * '/example/users/add'
 * '/example/users/:id'
 * '/example/users/:id?'
 * '/example/near/:lat-:lng/radius/:r'
 * '/example/at/:hour(^\\d{2})h:minute(^\\d{2})m'
 * '/example/users/name::verb' as 'example/users/name:verb'
 * '/example/users/(^\\d+)'
 * '/example/image/:file(^\\d+).:ext(png | jpg | jpeg | gif)'
 * '/example/:file(^\\d+).png'
 * '/example/*'
 */

export const NodeFlag = {
  STATIC: 1 << 0, //
  PARAM: 1 << 1, //
  OPT_PARAM: 1 << 2, //
  MULTI_PARAM: 1 << 3, //
  NON_PARAM: 1 << 4, //
  REGEXP: 1 << 5, //
  MULTI_REGEXP: 1 << 6, //
  WILDCARD: 1 << 7, //
} as const;

export type NodeFlag = (typeof NodeFlag)[keyof typeof NodeFlag];

export type Parameter = {
  name: string | null;
  value: string | null;
  optional: boolean;
  regexp: RegExp | null;
};

export type NodeChunk = {
  label: string;
  type: NodeFlag;
  params: Array<Parameter> | null;
};

export const parsePath = (path: string): Array<NodeChunk> => {
  const nodeChunks: Array<NodeChunk> = [];

  let paramAr: Array<Parameter> = [];

  let chunkValue = '';
  let nodeType = 0;
  let param: Parameter | null = null;
  let paramName: string | null = null;
  let paramValue = null;
  let paramFlag = false;
  let paramIndex = 0;
  let paramCount = 0;
  let regexpFlag = false;
  let regexpStack: string[] = [];

  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (char !== '/') {
      // Check if valid first character when not a '/' or '*'
      if (i === 0 && char !== '*') {
        throw new Error(
          'Invalid path - Path must start with "/" or be a wildcard "*"',
        );
      }
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
          if (char === ':' && path[i - 1] !== ':' && path[i - 1] !== '/') {
            if (path[i + 1] === ':') {
              // Create RegExp if flagged and there is a value
              const regexp =
                paramValue && isFlag(nodeType, NodeFlag.REGEXP)
                  ? new RegExp(paramValue)
                  : null;

              param = {
                name: paramName,
                value: paramValue,
                optional: false,
                regexp: regexp,
              };
              paramAr.push(param);

              paramFlag = false;
              paramName = '';
              paramValue = null;
              paramIndex = 0;
              param = null;
              continue;
            }

            throw new Error(
              'Invalid path - There must be a separating delimiter between parameters',
            );
          } else if (char === ':' && path[i - 1] === ':') {
            if (path[i + 1] === ':') {
              throw new Error(
                'Invalid path - A parameter cannot be defined with a ":" in the name',
              );
            }

            // If node is not already flagged for NON_PARAM, flag it
            if (!isFlag(nodeType, NodeFlag.NON_PARAM))
              nodeType += NodeFlag.NON_PARAM;

            paramFlag = false;
            paramName = '';
            paramValue = null;
            paramIndex = 0;
            param = null;

            if (paramCount > 0) {
              paramCount--;
            }
            if (paramCount < 2 && isFlag(nodeType, NodeFlag.MULTI_PARAM)) {
              nodeType -= NodeFlag.MULTI_PARAM;
            }
            if (paramCount < 1 && isFlag(nodeType, NodeFlag.PARAM)) {
              nodeType -= NodeFlag.PARAM;
            }
            continue;
          }

          // Must be a valid separator while defining parameters
          if (char !== '?' && char !== '-' && char !== '(') {
            throw new Error(
              'Invalid path - A parameter name can only contain alphanumeric characters, underscores, and dollar signs',
            );
          }

          // Create parameter object
          param = {
            name: paramName,
            value: paramValue,
            optional: false,
            regexp: null,
          };

          // Check if optional parameter
          if (char === '?') {
            if (
              isFlag(nodeType, NodeFlag.OPT_PARAM) ||
              isFlag(nodeType, NodeFlag.MULTI_PARAM)
            ) {
              throw new Error(
                'Invalid path - A parameter cannot be optional and multiparam',
              );
            }
            nodeType += NodeFlag.OPT_PARAM;
            param.optional = true;
            paramFlag = false;
            paramName = '';
            paramIndex = 0;

            // Check if last character and push chunk to array
            if (i === path.length - 1) {
              paramAr.push(param);
              nodeChunks.push({
                label: chunkValue,
                type: nodeType,
                params: paramAr.length > 0 ? paramAr : null,
              });
              return nodeChunks;
            }

            continue;
          }

          // Check if parameter is followed by RegExp
          if (char === '(') {
            regexpFlag = true;
            regexpStack.push(char);
            paramValue ? (paramValue += char) : (paramValue = char);
          }

          // Check if multiparam separator and push current param to array and reset param
          if (char === '-') {
            if (isFlag(nodeType, NodeFlag.OPT_PARAM)) {
              throw new Error(
                'Invalid path - A parameter cannot be optional and multiparam',
              );
            }
            // Create RegExp if flagged and there is a value
            const regexp =
              paramValue && isFlag(nodeType, NodeFlag.REGEXP)
                ? new RegExp(paramValue)
                : null;

            param.regexp = regexp;
            paramAr.push(param);
            param = null;
          }

          paramFlag = false;
          paramName = null;
          paramIndex = 0;
        } else {
          paramName ? (paramName += char) : (paramName = char);
          paramIndex++;
        }

        // Check if last character and push chunk to array
        if (i === path.length - 1) {
          // Create RegExp if flagged and there is a value
          const regexp =
            paramValue && isFlag(nodeType, NodeFlag.REGEXP)
              ? new RegExp(paramValue)
              : null;

          paramAr.push({
            name: paramName ?? null,
            value: paramValue,
            optional: false,
            regexp: regexp,
          });

          nodeChunks.push({
            label: chunkValue,
            type: nodeType,
            params: paramAr.length > 0 ? paramAr : null,
          });
          return nodeChunks;
        }

        continue;
      }

      // Check if currently defining regexp
      if (regexpFlag) {
        // check if param value is defined and add char to param value
        paramValue ? (paramValue += char) : (paramValue = char);

        // Check if char is closing delimiter
        if (char === ')') {
          // Check if closing delimiter is valid
          if (regexpStack.length < 1) {
            throw new Error(
              'Invalid path - RegExp closing delimiter ")" is missing opening delimiter "("',
            );
          }

          regexpStack.pop();

          if (regexpStack.length === 0) {
            // If all regexp are closed, reset regexp flag
            regexpFlag = false;

            // Check if regexp is already defined and flag as multi regexp else flag as regexp
            if (
              isFlag(nodeType, NodeFlag.REGEXP) &&
              !isFlag(nodeType, NodeFlag.MULTI_REGEXP)
            ) {
              nodeType += NodeFlag.MULTI_REGEXP;
            } else if (!isFlag(nodeType, NodeFlag.REGEXP)) {
              nodeType += NodeFlag.REGEXP;
            }
          }
        }

        // Check if char is opening delimiter
        if (char === '(') {
          // Check if last character
          if (i === path.length - 1) {
            throw new Error(
              'Invalid path - RegExp has no closing delimiter ")"',
            );
          }

          regexpStack.push(char);
        }

        // Check if last character and push chunk to array
        if (i === path.length - 1) {
          // Check if regexp flag is true then reset regexp flag
          if (regexpFlag || regexpStack.length > 0) {
            throw new Error(
              'Invalid path - RegExp has no closing delimiter ")"',
            );
          }

          // Create RegExp if flagged and there is a value
          const regexp =
            paramValue && isFlag(nodeType, NodeFlag.REGEXP)
              ? new RegExp(paramValue)
              : null;

          // Check if param is defined and push to array
          if (param) {
            param.value = paramValue;
            param.regexp = regexp;
            paramAr.push(param);
          }

          nodeChunks.push({
            label: chunkValue,
            type: nodeType,
            params: paramAr.length > 0 ? paramAr : null,
          });
          return nodeChunks;
        }

        continue;
      }

      // Check for start of parameter definition
      if (char === ':') {
        // Create RegExp if flagged and there is a value
        const regexp =
          paramValue && isFlag(nodeType, NodeFlag.REGEXP)
            ? new RegExp(paramValue)
            : null;

        if (paramValue && !param) {
          // Create parameter object
          param = {
            name: paramName ?? null,
            value: paramValue,
            optional: false,
            regexp: null,
          };
        }

        // Check if param is defined and push to array and reset param
        if (param) {
          param.value = paramValue;
          param.regexp = regexp;
          paramAr.push(param);
          param = null;
        }

        paramFlag = true;
        paramName = null;
        paramValue = null;
        paramIndex = 0;
        paramCount++;

        // Check if optional parameter is already defined
        if (isFlag(nodeType, NodeFlag.OPT_PARAM)) {
          throw new Error(
            'Invalid path - A parameter cannot be optional and multiparam',
          );
        }

        // Check if param is already defined and flag as multiparam else flag as param
        if (
          isFlag(nodeType, NodeFlag.PARAM) &&
          !isFlag(nodeType, NodeFlag.MULTI_PARAM)
        ) {
          nodeType += NodeFlag.MULTI_PARAM;
        } else if (!isFlag(nodeType, NodeFlag.PARAM)) {
          nodeType += NodeFlag.PARAM;
        }

        // Check if last character and push chunk to array
        if (i === path.length - 1) {
          nodeChunks.push({
            label: chunkValue,
            type: nodeType,
            params: paramAr.length > 0 ? paramAr : null,
          });
          return nodeChunks;
        }

        continue;
      }

      // Check for start of regexp definition
      if (char === '(') {
        if (regexpStack.length <= 0) {
          // Create RegExp if flagged and there is a value
          const regexp =
            paramValue && isFlag(nodeType, NodeFlag.REGEXP)
              ? new RegExp(paramValue)
              : null;

          if (paramValue && !param) {
            // Create parameter object
            param = {
              name: paramName ?? null,
              value: paramValue,
              optional: false,
              regexp: null,
            };
          }

          // Check if param is defined and push to array and reset param
          if (param) {
            param.value = paramValue;
            param.regexp = regexp;
            paramAr.push(param);
            param = null;
          }
        }

        regexpFlag = true;
        regexpStack.push(char);

        paramValue ? (paramValue += char) : (paramValue = char);

        // Check if last character
        if (i === path.length - 1) {
          throw new Error('Invalid path - RegExp has no closing delimiter ")"');
        }

        continue;
      }

      // Check for end of regexp definition
      if (char === ')') {
        // Check if closing delimiter is valid
        if (regexpStack.length < 1) {
          throw new Error(
            'Invalid path - RegExp closing delimiter ")" is missing opening delimiter "("',
          );
        }

        regexpStack.pop();

        if (regexpStack.length === 0) {
          // If all regexp are closed, reset regexp flag
          regexpFlag = false;
          // Check if regexp is already defined and flag as multi regexp else flag as regexp
          if (
            isFlag(nodeType, NodeFlag.REGEXP) &&
            !isFlag(nodeType, NodeFlag.MULTI_REGEXP)
          ) {
            nodeType += NodeFlag.MULTI_REGEXP;
          } else if (!isFlag(nodeType, NodeFlag.REGEXP)) {
            nodeType += NodeFlag.REGEXP;
          }
        }

        // Check if last character and push chunk to array
        if (i === path.length - 1) {
          if (regexpStack.length !== 0) {
            throw new Error(
              'Invalid path - RegExp has no closing delimiter ")"',
            );
          }

          // Create RegExp if flagged and there is a value
          const regexp =
            paramValue && isFlag(nodeType, NodeFlag.REGEXP)
              ? new RegExp(paramValue)
              : null;

          if (param) {
            paramAr.push({
              name: paramName ?? null,
              value: paramValue,
              optional: false,
              regexp: regexp,
            });
          }

          nodeChunks.push({
            label: chunkValue,
            type: nodeType,
            params: paramAr.length > 0 ? paramAr : null,
          });
          return nodeChunks;
        }

        continue;
      }

      // Check for wildcard
      if (char === '*') {
        // Check if wildcard is already defined
        if (isFlag(nodeType, NodeFlag.WILDCARD)) {
          throw new Error('Invalid path - A wildcard "*" is already defined');
        }

        nodeType += NodeFlag.WILDCARD;

        // Check if last character and push chunk to array
        if (i === path.length - 1) {
          nodeChunks.push({
            label: chunkValue,
            type: nodeType,
            params: paramAr.length > 0 ? paramAr : null,
          });
          return nodeChunks;
        }

        continue;
      }

      paramValue ? (paramValue += char) : (paramValue = char);

      // Check if last character and push chunk to array
      if (i === path.length - 1) {
        if (nodeType === 0) nodeType += NodeFlag.STATIC;

        // Replace '::' with ':'
        chunkValue = chunkValue.replace(/::/g, ':');

        // Create RegExp if flagged and there is a value
        const regexp =
          paramValue && isFlag(nodeType, NodeFlag.REGEXP)
            ? new RegExp(paramValue)
            : null;

        // Check if param is defined and push to array
        if (param) {
          param.value = paramValue;
          param.regexp = regexp;
          paramAr.push(param);
        }

        nodeChunks.push({
          label: chunkValue,
          type: nodeType,
          params: paramAr.length > 0 ? paramAr : null,
        });
        return nodeChunks;
      }

      continue;
    }

    // If first character value and path.length === 1, then static root path
    if (i === 0 && path.length === 1) {
      nodeType += NodeFlag.STATIC;

      nodeChunks.push({
        label: '',
        type: nodeType,
        params: null,
      });

      return nodeChunks;
    }

    // Check if param flag is true then create param and push param to array
    if (paramFlag || (paramValue && !param)) {
      // Create RegExp if flagged and there is a value
      const regexp =
        paramValue && isFlag(nodeType, NodeFlag.REGEXP)
          ? new RegExp(paramValue)
          : null;

      param = {
        name: paramName ?? null,
        value: paramValue,
        optional: false,
        regexp: regexp,
      };

      paramAr.push(param);
      paramFlag = false;
      paramName = '';
      paramValue = null;
      param = null;
    }

    // Check if param is defined and push to array and reset param
    if (param) {
      // Create RegExp if flagged and there is a value
      const regexp =
        paramValue && isFlag(nodeType, NodeFlag.REGEXP)
          ? new RegExp(paramValue)
          : null;

      param.value = paramValue;
      param.regexp = regexp;
      paramAr.push(param);
      paramFlag = false;
      paramName = '';
      paramValue = null;
      param = null;
    }

    // Check if regexp flag is true then reset regexp flag
    if (regexpFlag || regexpStack.length > 0) {
      throw new Error('Invalid path - RegExp has no closing delimiter ")"');
    }

    if (nodeType === 0) nodeType += NodeFlag.STATIC;

    // Replace '::' with ':'
    chunkValue = chunkValue.replace(/::/g, ':');

    nodeChunks.push({
      label: chunkValue,
      type: nodeType,
      params: paramAr.length > 0 ? paramAr : null,
    });

    // Reset all chunk values
    paramAr = [];
    chunkValue = '';
    nodeType = 0;
    param = null;
    paramName = '';
    paramValue = null;
    paramFlag = false;
    paramIndex = 0;
    paramCount = 0;
    regexpFlag = false;
    regexpStack = [];
  }

  return nodeChunks;
};

export const validParamChar = (char: string, index: number): boolean => {
  return index - 1 === 0 ? /[a-zA-Z_$]/.test(char) : /[a-zA-Z0-9_$]/.test(char);
};

export const validRegExp = (pattern: string): boolean => {
  return pattern.match(/^\(.+\)/) !== null;
};

export const isFlag = (byte: number, flag: number): boolean => {
  return (byte & flag) === flag;
};

export const getFlags = (
  byte: number,
): Record<keyof typeof NodeFlag, boolean> => {
  return {
    STATIC: isFlag(byte, NodeFlag.STATIC),
    PARAM: isFlag(byte, NodeFlag.PARAM),
    OPT_PARAM: isFlag(byte, NodeFlag.OPT_PARAM),
    MULTI_PARAM: isFlag(byte, NodeFlag.MULTI_PARAM),
    NON_PARAM: isFlag(byte, NodeFlag.NON_PARAM),
    REGEXP: isFlag(byte, NodeFlag.REGEXP),
    MULTI_REGEXP: isFlag(byte, NodeFlag.MULTI_REGEXP),
    WILDCARD: isFlag(byte, NodeFlag.WILDCARD),
  };
};
