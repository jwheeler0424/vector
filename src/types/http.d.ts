import { Methods } from '../Maps';

type UCaseHttpMethod = Uppercase<typeof Methods[keyof typeof Methods]>;

type LCaseHttpMethod = Lowercase<typeof Methods[keyof typeof Methods]>;

type HttpMethod = UCaseHttpMethod | LCaseHttpMethod;
