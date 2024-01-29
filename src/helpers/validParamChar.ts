const validParamChar = (char: string, index: number): boolean => {
  return index - 1 === 0 ? /[a-zA-Z_$]/.test(char) : /[a-zA-Z0-9_$]/.test(char);
};

export default validParamChar;