// import type { HandlerFunction } from '@/types/handler';
// import { type UCaseHttpMethod, Methods } from '@/types/http';
import type { NodeChunk, Parameter, RouterNode } from '@/types/trie';
import { Node } from './Node';
import { isFlag, validParamChar } from '@/helpers';
import { NodeFlag } from '@/Maps';

/**
 * RouterTrie
 * ------------------------------------------------------------------------------
 * A router trie is a data structure used to store and retrieve routes. The trie
 * is a tree-like data structure that stores routes as nodes. The trie is a
 * prefix tree, meaning that each node in the trie represents a prefix of the
 * path. The trie is a compact data structure that allows for fast lookups.
 *
 * When inserting a route, the trie will throw an error if the route
 * already exists. The trie does not support duplicate routes. The trie will
 * throw an error if the path does not start with a forward slash '/'. The trie
 * will throw an error if the http method is not supported. The trie supports
 * the following http methods: GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.
 *
 * When matching a route, the trie will return an object with the handler
 * function and the matching route chunks. The trie will return false if the
 * route does not exist. The trie will throw an error if the path does not start
 * with a forward slash '/'. The trie will throw an error if the http method is
 * not supported. The trie supports the following http methods: GET, POST, PUT,
 * PATCH, DELETE, HEAD, and OPTIONS. The matching method will follow a resolve
 * precedence. The trie will first try to match the exact path. If the exact
 * path does not exist, the trie will try to match a parameterized path. If the
 * parameterized path does not exist, the trie will try to match a regex path.
 * If the regex path does not exist, the trie will try to match a wildcard path.
 * If the wildcard path does not exist, the trie will return false.
 */

export type RouterTrie = {
  // insert(path: string, method: UCaseHttpMethod, handler: HandlerFunction): void;
  // match(path: string, method?: UCaseHttpMethod): MatchedRoute | false;
  // depricated(path: string, method?: UCaseHttpMethod): void;
  // remove(key: string | string[]): void;
  // contains(key: string | string[]): boolean;
  // startsWith(prefix: string): Promise<Array<string>>;
  reset(): void;
  // display(): void;
  // toObject(): Record<string, unknown>
  // toString(): string;
  getDepth(): number;
};

export default class Trie implements RouterTrie {
  private root: RouterNode;
  private depth: number;

  constructor() {
    this.root = new Node();
    this.depth = 0;
  }

  /**
   * RouterTrie - Insert
   * ----------------------------------------------------------------------------
   * Insert a path into the trie.
   *
   * @name insert
   * @description
   * This method inserts a path into the trie. The path is traversed and each
   * forward slash '/' starts a new node branch.
   *
   * @example
   * const trie = new Trie();
   *
   * trie.insert('/users/:id', 'GET', () => {});
   * trie.insert('/users/:id/:name', 'GET', () => {});
   * trie.insert('/users/:id/:name/edit', 'GET', () => {});
   *
   * @param {string} path - The url path to insert
   * @param {UCaseHttpMethod} method - The http method to insert
   * @param {HandlerFunction} handler - The handler function to insert
   * @returns {void}
   */
  // insert(
  //   path: string,
  //   method: UCaseHttpMethod,
  //   handler: HandlerFunction,
  // ): void {
  //   if (path[0] !== '/') {
  //     throw new Error('Path must start with a /');
  //   }

  //   if (!Methods[method]) {
  //     throw new Error('Invalid http method - Method not supported');
  //   }

  //   let currentNode = this.root;
  //   let pathIndex = 0;
  //   let labelIndex = 0;
  //   let pathDepth = 0;
  //   let currentChunk = '';
  //   let paramName = '';
  //   let paramOptional = false;
  //   let paramFlag = false;
  //   let regexpFlag = false;

  //   while (pathIndex < path.length) {
  //     const key = path[pathIndex] as Char;
  //     const isLastChar = pathIndex === path.length - 1;
  //     const isForwardSlash = key === '/';
  //     const isParamDelimiter = key === ':';
  //     const isRegExpOpenDelimiter = key === '(';

  //     // currentChunk += key;

  //     const child = currentNode.children
  //       ? currentNode.children.get(key)
  //       : undefined;

  //     // If the child exists and the key is a forward slash, reset the current chunk,
  //     // update the current node and increment the current index then continue the loop
  //     if (child && isForwardSlash) {
  //       currentChunk = '';
  //       labelIndex = 0;
  //       paramName = '';
  //       paramOptional = false;
  //       pathIndex++;
  //       if (!isLastChar) {
  //         // TODO: add support for trailing slashes
  //         currentNode = child;
  //         pathDepth++;
  //       }
  //       continue;
  //     }

  //     // If the child exists and the key is a param delimiter, check if the param matches
  //     // the node params
  //     if (child && isParamDelimiter) {
  //       // Reset the label index, param name, and param optional
  //       labelIndex = 0;
  //       paramName = '';
  //       paramOptional = false;

  //       // Check if the param delimiter is the last character
  //       if (isLastChar) {
  //         throw new Error(
  //           'Invalid path - Parameter delimiter cannot be last character',
  //         );
  //       }

  //       // Check if the label is null
  //       const label = child.label;
  //       if (label === null) {
  //         throw new Error(
  //           'Invalid path - Path node label must be given some value',
  //         );
  //       }

  //       // Check if the param delimiter is followed by a separating delimiter
  //       const nextChar: Char | undefined = path[pathIndex + 1] as
  //         | Char
  //         | undefined;
  //       if (
  //         !nextChar ||
  //         nextChar === '/' ||
  //         nextChar === '(' ||
  //         nextChar === '-'
  //       ) {
  //         throw new Error('Invalid path - Parameter must be given a name');
  //       }

  //       // Check if the param delimiter is followed by another param delimiter
  //       if (nextChar === ':') {
  //         pathIndex++;
  //         continue;
  //       }

  //       // Compare the label and the path to check for param match
  //       while (labelIndex < label.length && pathIndex < path.length) {
  //         // Check if the param delimiter is followed by a separating delimiter
  //         if (labelIndex > 0 && path[pathIndex + labelIndex] === ':') {
  //           throw new Error(
  //             'Invalid path - There must be a separating delimiter between parameters',
  //           );
  //         }

  //         // Check if separating delimiter is reached
  //         if (
  //           path[pathIndex + labelIndex] === '/' ||
  //           path[pathIndex + labelIndex] === '(' ||
  //           path[pathIndex + labelIndex] === '-'
  //         )
  //           break;

  //         // Check if the parameter is optional and use as separator
  //         if (path[pathIndex + labelIndex] === '?') {
  //           paramOptional = true;
  //           break;
  //         }

  //         // Check if the label and the path mismatch
  //         if (label[labelIndex] !== path[pathIndex + labelIndex]) {
  //           throw new Error(
  //             'Invalid path - There are conflicting path parameters',
  //           );
  //         }

  //         if (path[pathIndex + labelIndex] !== ':')
  //           paramName += path[pathIndex + labelIndex];

  //         labelIndex++;
  //       }

  //       // Check if the param match completely matched the label
  //       if (
  //         (child.params && !child.params[paramName]) ||
  //         (child.params &&
  //           child.params[paramName] &&
  //           child.params[paramName].optional !== paramOptional)
  //       ) {
  //         throw new Error(
  //           'Invalid path - There are conflicting path parameters',
  //         );
  //       }

  //       // If the param match completely matched the label, update the current node
  //       // and increment the current index then continue the loop
  //       pathDepth++;
  //       currentNode = child;
  //       pathIndex += labelIndex - 1;
  //     }

  //     if (child && isRegExpOpenDelimiter) {
  //       // Check if the regexp delimiter is the last character
  //       if (isLastChar) {
  //         throw new Error(
  //           'Invalid path - Regular expression delimiter cannot be last character',
  //         );
  //       }

  //       // Check if the label is null
  //       const label = child.label;
  //       if (label === null) {
  //         throw new Error(
  //           'Invalid path - Path node label must be given some value',
  //         );
  //       }

  //       // Compare the label and the path to check for regexp match
  //       while (labelIndex < label.length && pathIndex < path.length) {
  //         // Check if closing regexp delimiter is reached
  //         if (path[pathIndex + labelIndex] === ')') break;

  //         // Check if the label and the path mismatch
  //         if (label[labelIndex] !== path[pathIndex + labelIndex]) break;

  //         labelIndex++;
  //       }

  //       // Check if the regexp match completely matched the label
  //       if (child.params && !child.params[paramName]) {
  //         throw new Error(
  //           'Invalid path - There are conflicting path regular expressions',
  //         );
  //       }

  //       // If the regexp match completely matched the label, update the current node
  //       // and increment the current index then continue the loop
  //       pathDepth++;
  //       currentNode = child;
  //       pathIndex += labelIndex - 1;

  //       // Reset the label index, param name, and param optional
  //       if (labelIndex === label.length) labelIndex = 0;
  //       paramName = '';
  //       paramOptional = false;
  //     }

  //     // // If the child exists and the node is not a leaf, update the current node
  //     // // and increment the current index then continue the loop
  //     // if (child && !isLeaf) {
  //     //   currentNode = child;
  //     //   currentIndex++;
  //     //   continue;
  //     // }

  //     // // Check if the prefix is parameterized, a wildcard, or regex
  //     // const isParam = prefix[0] === ':';
  //     // const isWildcard = prefix === '*';
  //     // const isRegex = prefix[0] === '/' ? this.isRegex(prefix) : false;

  //     // // If the child does not exist, create a new node
  //     // const newNode = new Node();
  //     // newNode.prefix = prefix;
  //     // newNode.size = !isWildcard && !isParam && !isRegex ? prefix.length : 0;
  //     // newNode.parent = currentNode;
  //     // newNode.handler = isLeaf ? handler : null;
  //     // newNode.isLeaf = isLeaf;
  //     // newNode.isParam = isParam;
  //     // newNode.isWildcard = isWildcard;
  //     // newNode.isRegex = isRegex;

  //     // // If the current node does not have children, create a new map
  //     // if (!currentNode.children) {
  //     //   currentNode.children = new Map();
  //     // }

  //     // currentNode.children.set(prefix, newNode);

  //     // // If the node is a leaf, break the loop
  //     // if (isLeaf) {
  //     //   break;
  //     // }

  //     // Update the current node and increment the current index
  //     // currentNode = newNode;
  //     pathIndex++;
  //   }

  //   // Update the depth of the trie
  //   this.depth = Math.max(this.depth, pathDepth);

  //   return;
  // }

  // match(path: string, method?: UCaseHttpMethod): MatchedRoute | false {
  //   if (path[0] !== '/') {
  //     throw new Error('Path must start with a /');
  //   }

  //   // Set default method to 'GET' if no method is provided
  //   if (!method) {
  //     method = 'GET';
  //   }

  //   if (!Methods[method]) {
  //     throw new Error('Invalid http method - Method not supported');
  //   }

  //   const pathChunks = this.splitPath(path);

  //   const matchedRoute: string[] = [];
  //   let currentNode = this.root;
  //   let currentIndex = 0;

  //   pathChunks[0] = method;

  //   while (currentIndex < pathChunks.length) {
  //     if (!currentNode.children) {
  //       return false;
  //     }

  //     const prefix = pathChunks[currentIndex];
  //     const child = currentNode.children.get(prefix);

  //     // If the child exists, check if the child is a leaf
  //     // If the child is a leaf, return the MatchedRoute object
  //     // If the child is not a leaf, update the current node and increment the
  //     // current index then continue the loop
  //     if (child) {
  //       matchedRoute.push(prefix);

  //       if (child.isLeaf) {
  //         return {
  //           handler: child.handler as HandlerFunction,
  //           matched: matchedRoute,
  //           route: pathChunks,
  //         };
  //       }

  //       currentNode = child;
  //       currentIndex++;
  //       continue;
  //     }

  //     // Loop through children to check for parameterized children, regex
  //     // children, and wildcard children
  //     for (const [key, value] of currentNode.children) {
  //       // Check if the child is parameterized
  //       if (value.isParam) {
  //         matchedRoute.push(key);

  //         if (value.isLeaf) {
  //           return {
  //             handler: value.handler as HandlerFunction,
  //             matched: matchedRoute,
  //             route: pathChunks,
  //           };
  //         }

  //         currentNode = value;
  //         currentIndex++;
  //         break;
  //       }

  //       // Check if the child is a regex
  //       if (value.isRegex) {
  //         matchedRoute.push(key);

  //         if (value.isLeaf) {
  //           return {
  //             handler: value.handler as HandlerFunction,
  //             matched: matchedRoute,
  //             route: pathChunks,
  //           };
  //         }

  //         currentNode = value;
  //         currentIndex++;
  //         break;
  //       }

  //       // Check if the child is a wildcard
  //       if (value.isWildcard) {
  //         matchedRoute.push(key);

  //         if (value.isLeaf) {
  //           return {
  //             handler: value.handler as HandlerFunction,
  //             matched: matchedRoute,
  //             route: pathChunks,
  //           };
  //         }

  //         currentNode = value;
  //         currentIndex++;
  //         break;
  //       }
  //     }
  //   }

  //   return false;
  // }

  /**
   * RouterTrie - Reset
   * ----------------------------------------------------------------------------
   * Reset the trie.
   *
   * @name reset
   * @description
   * This method resets the trie. The time complexity of this method is O(1).
   *
   * @example
   * const trie = new Trie();
   *
   * trie.insert('/users/:id', 'GET', () => {});
   * trie.insert('/users/:id/:name', 'GET', () => {});
   * trie.insert('/users/:id/:name/edit', 'GET', () => {});
   *
   * trie.reset();
   *
   * @returns {void}
   */
  reset(): void {
    this.root = new Node();
    this.depth = 0;
  }

  /**
   * RouterTrie - Get Depth
   * ----------------------------------------------------------------------------
   * Get the depth of the trie.
   *
   * @name getDepth
   * @description
   * This method returns the depth of the trie. The depth of the trie is the
   * length of the longest path in the trie. The time complexity of this method
   * is O(1).
   *
   * @example
   * const trie = new Trie();
   *
   * trie.insert('/users/:id', 'GET', () => {});
   * trie.insert('/users/:id/:name', 'GET', () => {});
   * trie.insert('/users/:id/:name/edit', 'GET', () => {});
   *
   * console.log(trie.getDepth());
   * // 4
   *
   * @returns {number} The depth of the trie
   */
  getDepth(): number {
    return this.depth;
  }

  /* ============================================================================ */
  /*                                Helper Methods                                */
  /* ============================================================================ */

  /**
   * Parse Path
   * ----------------------------------------------------------------------------
   * Split the path into an array of chunks.
   *
   * @name parsePath
   * @description
   * This method splits the path into an array of chunks. The chunks are split by
   * the forward slash '/' character. The chunks are returned as an array. The
   * time complixity of this method is O(n) where n is the length of the path.
   *
   * @param {string} path - The path to split
   * @returns {NodeChunk[]} The array of path chunks
   *
   * @example
   * const path = `/example/at/:hour(^\\d{2})h:minute(^\\d{2})m`;
   * const chunks = parsePath(path);
   *
   * console.log(chunks);
   * // [{
   * //   "label": "",
   * //   "type": 1,
   * //   "params": null
   * // }, {
   * //   "label": "example",
   * //   "type": 1,
   * //   "params": null
   * // }, {
   * //   "label": "at",
   * //   "type": 1,
   * //   "params": null
   * // }, {
   * //   "label": ":hour(^\\d{2})h:minute(^\\d{2})m",
   * //   "type": 106,
   * //   "params": [
   * //     {
   * //       "name": "hour",
   * //       "value": "(^\\d{2})h",
   * //       "optional": false,
   * //       "regexp": {}
   * //     },
   * //     {
   * //       "name": "minute",
   * //       "value": "(^\\d{2})m",
   * //       "optional": false,
   * //       "regexp": {}
   * //     }
   * //   ]
   * // }]
   */
  private parsePath = (path: string): Array<NodeChunk> => {
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
                  name: paramName ?? null,
                  value: paramValue,
                  optional: false,
                  regexp: regexp,
                };
                paramAr.push(param);
  
                paramFlag = false;
                paramName = null;
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
              paramName = null;
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
              name: paramName ?? null,
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
              paramName = null;
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
              paramValue = null;
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
  
            if (paramValue && !param) {
              // Create parameter object
              param = {
                name: paramName ?? null,
                value: paramValue,
                optional: false,
                regexp: regexp,
              };
            }
  
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
              paramValue = null;
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
          if (regexpStack.length < 1 || !regexpFlag) {
            throw new Error(
              'Invalid path - RegExp closing delimiter ")" is missing opening delimiter "("',
            );
          }
  
          regexpStack.pop();
          paramValue ? (paramValue += char) : (paramValue = char);
  
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
  
            if (paramValue && !param) {
              // Create parameter object
              param = {
                name: paramName ?? null,
                value: paramValue,
                optional: false,
                regexp: regexp,
              };
            }
  
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
  
        if (paramValue) paramValue += char;
  
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
  
          if (paramValue && !param) {
            // Create parameter object
            param = {
              name: paramName ?? null,
              value: paramValue,
              optional: false,
              regexp: regexp,
            };
          }
  
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
        paramName = null;
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
        paramName = null;
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
}
