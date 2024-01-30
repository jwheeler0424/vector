export default class CommonError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}