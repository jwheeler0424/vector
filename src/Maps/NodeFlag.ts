export const nodeFlag = {
  STATIC: 1 << 0,
  PARAM: 1 << 1,
  OPT_PARAM: 1 << 2,
  MULTI_PARAM: 1 << 3,
  NON_PARAM: 1 << 4,
  REGEXP: 1 << 5,
  MULTI_REGEXP: 1 << 6,
  WILDCARD: 1 << 7,
} as const;
