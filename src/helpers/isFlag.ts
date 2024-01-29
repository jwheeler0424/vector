const isFlag = (byte: number, flag: number): boolean => {
  return (byte & flag) === flag;
};

export default isFlag;