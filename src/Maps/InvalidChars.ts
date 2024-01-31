export const invalidChars: Record<string, boolean> = {
  ' ': true,
  '\t': true,
  '\n': true,
  '\r': true,
  '\f': true,
  '\v': true,
  '\u00A0': true,
  '\u1680': true,
  '?': true,
};