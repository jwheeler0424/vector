import { NodeFlag } from "../Maps";
import { isFlag } from "./";


const getFlags = (
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

export default getFlags;