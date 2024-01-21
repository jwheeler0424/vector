/**
 * Stack data structure
 * 
 * @class Stack
 * @template T The type of the items in the stack
 * @public
 * 
 * @property {T[]} items The items in the stack
 * @method push Adds an item to the stack
 * @method pop Removes an item from the top of the stack and returns it
 * @method peek Returns the item at the top of the stack without removing it
 * @method isEmpty Returns a boolean indicating whether the stack is empty
 * @method size Returns the number of items in the stack
 * @method reset Resets the stact to an empty state
 * @exports Stack
 * 
 * @example
 * const stack = new Stack<number>();
 * 
 * stack.push(1);
 * stack.push(2);
 * stack.push(3);
 * 
 * console.log(stack.peek()); // 3
 * console.log(stack.size()); // 3
 * console.log(stack.isEmpty()); // false
 * 
 * stack.pop();
 * stack.pop();
 * 
 * console.log(stack.peek()); // 1
 * console.log(stack.size()); // 1
 * console.log(stack.isEmpty()); // false
 * 
 * stack.pop();
 * 
 * console.log(stack.peek()); // undefined
 * console.log(stack.size()); // 0
 * console.log(stack.isEmpty()); // true
 * 
 * stack.pop(); // Error: Stack is empty
 */
export class Stack<T = void> {
  items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * Adds an item to the stack
   * 
   * @param item The item to be added to the stack
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes an item from the top of the stack and returns it
   * 
   * @returns The item at the top of the stack
   */
  pop(): T | undefined {
    if (this.isEmpty()) throw new Error('Stack is empty');
    return this.items.pop();
  }

  /**
   * Returns the item at the top of the stack without removing it
   * 
   * @returns The item at the top of the stack
   */
  peek(): T | undefined {
    if (this.isEmpty()) throw new Error('Stack is empty');
    return this.items.at(-1)
  }

  /**
   * Returns a boolean indicating whether the stack is empty
   * 
   * @returns True if the stack is empty, false otherwise
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns the number of items in the stack
   * 
   * @returns The number of items in the stack
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Resets the stact to an empty state
   * 
   * @returns {void}
   */
  reset(): void {
    this.items = [];
  }
}