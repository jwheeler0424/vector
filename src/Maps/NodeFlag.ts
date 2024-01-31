export const nodeFlag = {
  STATIC: 1 << 0,
  NON_PARAM: 1 << 1,
  REGEXP: 1 << 2,
  MULTI_REGEXP: 1 << 3,
  PARAM: 1 << 4,
  OPT_PARAM: 1 << 5,
  MULTI_PARAM: 1 << 6,
  WILDCARD: 1 << 7,
} as const;
