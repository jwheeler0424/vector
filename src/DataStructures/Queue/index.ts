/**
 * Queue data structure
 * 
 * @class Queue
 * @template T The type of the items in the queue
 * @property {Record<number, T>} items The items in the queue
 * @property {number} rear The rear of the queue
 * @property {number} front The front of the queue
 * @method enqueue Adds an item to the queue
 * @method dequeue Removes an item from the queue and returns it
 * @method peek Returns the first item in the queue without removing it
 * @method isEmpty Checks if the queue is empty
 * @method size Returns the size of the queue
 * @method print Prints the queue
 * @method reset Resets the queue
 * @exports Queue
 * 
 * @example
 * const queue = new Queue();
 * 
 * queue.enqueue(1);
 * queue.enqueue(2);
 * queue.enqueue(3);
 * queue.enqueue(4);
 * 
 * queue.print(); // 1 -> 2 -> 3 -> 4
 * 
 * queue.dequeue();
 * queue.dequeue();
 * 
 * queue.print(); // 3 -> 4
 * 
 * queue.enqueue(5);
 * queue.enqueue(6);
 * 
 * queue.print(); // 3 -> 4 -> 5 -> 6
 * 
 * queue.peek(); // 3
 * 
 * queue.size(); // 4
 * 
 * queue.isEmpty(); // false
 * 
 * queue.reset();
 * 
 * queue.isEmpty(); // true
 * 
 * queue.print(); //
 */
export class Queue<T> {
  items: Record<number, T>;
  rear: number;
  front: number;

  constructor() {
    this.items = {};
    this.rear = 0;
    this.front = 0;
  }

  /**
   * Adds an item to the queue
   * 
   * @param item The item to be added to the queue
   */
  enqueue(item: T): void {
    this.items[this.rear] = item;
    this.rear++;
  }

  /**
   * Removes an item from the queue and returns it
   * 
   * @returns The removed item
   */
  dequeue(): T {
    if (this.isEmpty()) throw new Error('Queue is empty');

    const item = this.items[this.front];
    delete this.items[this.front];
    this.front++;

    if (this.isEmpty()) this.reset();

    return item;
  }

  /**
   * Returns the first item in the queue without removing it
   * 
   * @returns The first item in the queue
   */
  peek(): T {
    if (this.isEmpty()) throw new Error('Queue is empty');

    return this.items[this.front];
  }

  /**
   * Checks if the queue is empty
   * 
   * @returns True if the queue is empty, false otherwise
   */
  isEmpty(): boolean {
    return this.rear === this.front;
  }

  /**
   * Returns the size of the queue
   * 
   * @returns The size of the queue
   */
  size(): number {
    return this.rear - this.front;
  }

  /**
   * Prints the queue
   */
  print(): void {
    if (this.isEmpty()) return;

    let result = '';
    for (let i = this.front; i < this.rear; i++) {
      result += i === this.rear - 1 ? `${this.items[i]}` : `${this.items[i]} -> `;
    }
    console.log(result.trim());
  }

  /**
   * Resets the queue
   */
  reset() {
    this.items = {};
    this.rear = 0;
    this.front = 0;
  }
}