import { Error } from "./";

export default class InvalidPathError extends Error {
  constructor(
    message?: string,
    options?: ErrorOptions & {
      code?: string;
      previous?: Throwable;
    },
  ) {
    super(message, options);
    this.name = 'InvalidPathError';
    if (!options?.code) this.code = 'E_INVALID_PATH';
    if (!message) this.message = 'The path provided is invalid.';
    
    Object.setPrototypeOf(this, new.target.prototype);
  }
}