import { isReserved } from "./";

const isValidParamName = (name: string): boolean => {
  const initRegex = new RegExp(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/);
  return initRegex.test(name) && !isReserved(name);
}

export default isValidParamName;
