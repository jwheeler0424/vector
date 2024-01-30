import CommonError from "./CommonError";

export default class Error extends CommonError implements Throwable {
  code: string | null = null;
  previousError: Throwable | null = null;
  structuredStack: StructuredStack[] | undefined;
  stackTrace: StackFrame[] | undefined;

  /**
   * Create a new error instance.
   *
   * @param message
   */
  constructor(
    message?: string,
    options?: ErrorOptions & {
      code?: string;
      previous?: Throwable;
    },
  ) {
    super(message, options);
    this.code = options?.code || 'E_ERROR';
    this.previousError = options?.previous || null;
    Object.setPrototypeOf(this, new.target.prototype);

    Error.prepareStackTrace = (_, structuredStackTrace) => {
      this.structuredStack = structuredStackTrace
        .map((frame: StackFrame) => {
          return {
            this: frame.getThis(),
            typeName: frame.getTypeName(),
            functionName: frame.getFunctionName(),
            methodName: frame.getMethodName(),
            fileName: frame.getFileName(),
            lineNumber: frame.getLineNumber(),
            columnNumber: frame.getColumnNumber(),
            function: frame.getFunction(),
            evalOrigin: frame.getEvalOrigin(),
            isNative: frame.isNative(),
            isToplevel: frame.isToplevel(),
            isEval: frame.isEval(),
            isConstructor: frame.isConstructor(),
            isAsync: frame.isAsync(),
            isPromiseAll: frame.isPromiseAll(),
            promiseIndex: frame.getPromiseIndex() || undefined,
          };
        })
        .slice(1);
      return structuredStackTrace;
    };
  }

  /**
   * Get the error message.
   *
   * @return string
   */
  public getMessage(): string {
    return this.message;
  }

  /**
   * Get the error code.
   *
   * @return number
   */
  public getCode(): string {
    return this.code || 'E_ERROR';
  }

  /**
   * Get the file in which the error occurred.
   *
   * @return string
   */
  public getFile(): string {
    return this.structuredStack?.[0].fileName || '';
  }

  /**
   * Get the line on which the error occurred.
   *
   * @return number
   */
  public getLine(): number | null | undefined {
    return this.structuredStack?.[0].lineNumber;
  }

  /**
   * Get the stack trace.
   *
   * @return string
   */
  public getTrace(): StackFrame[] {
    return this.stackTrace || [];
  }

  /**
   * Get the stack trace as a string.
   *
   * @return string
   */
  public getTraceAsString(): string {
    return this.stack || '';
  }

  /**
   * Get the previous error.
   *
   * @return Throwable
   */
  public getPrevious(): Throwable | null {
    return this.previousError;
  }
}
