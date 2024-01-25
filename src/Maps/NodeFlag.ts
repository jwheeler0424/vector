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
