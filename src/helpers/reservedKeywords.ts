const isReserved = (word: string): boolean => reservedKeywords[word] || false;
export default isReserved;

export const reservedKeywords: Record<string, boolean> = {
  abstract: false,          // Removed EM6
  arguments: true,
  await: true,
  boolean: false,           // Removed EM6
  break: true,
  byte: false,              // Removed EM6
  case: true,
  catch: true,
  char: false,              // Removed EM6
  class: true,
  const: true,
  continue: true,
  debugger: true,
  default: true,
  delete: true,
  do: true,
  double: false,            // Removed EM6
  else: true,
  enum: true,
  eval: true,
  export: true,
  extends: true,
  false: true,
  final: false,             // Removed EM6
  finally: true,
  float: false,             // Removed EM6
  for: true,
  function: true,
  goto: false,              // Removed EM6
  if: true,
  implements: true,
  import: true,
  in: true,
  instanceof: true,
  int: false,               // Removed EM6
  interface: true,
  let: true,
  long: false,              // Removed EM6
  native: false,            // Removed EM6
  new: true,
  null: true,
  package: true,
  private: true,
  protected: true,
  public: true,
  return: true,
  short: false,             // Removed EM6
  static: true,
  super: true,
  switch: true,
  synchronized: false,      // Removed EM6
  this: true,
  throw: true,
  throws: false,            // Removed EM6
  transient: false,         // Removed EM6
  true: true,
  try: true,
  typeof: true,
  var: true,
  void: true,
  volatile: false,          // Removed EM6
  while: true,
  with: true,
  yield: true,
}