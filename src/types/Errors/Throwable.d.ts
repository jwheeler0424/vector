/**
 * Throwable is the base interface for any object that can be thrown via a throw statement
 */

type Throwable = Error & {
  /* Gets the message */
  getMessage(): string;

  /* Gets the error code */
  getCode(): string;

  /* Gets the file in which the error occurred */
  getFile(): string;

  /* Gets the line on which the error occurred */
  getLine(): number | null | undefined;

  /* Gets the stack trace */
  getTrace(): StackFrame[];

  /* Gets the stack trace as a string */
  getTraceAsString(): string;

  /* Returns the previous Throwable */
  getPrevious(): Throwable | null;

  /* Returns a string representation of the object. */
  toString(): string;
}