const validRegExp = (pattern: string): boolean => {
  return pattern.match(/^\(.+\)/) !== null;
};

export default validRegExp;