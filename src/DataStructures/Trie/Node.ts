type TrieNode = {
  key: string | null;
  label: string | null;
  size: number;
  parent: TrieNode | null;
  children: Map<string, TrieNode> | null;
  isLeaf: boolean;
};

export class Node implements TrieNode {
  key: string | null;
  label: string | null;
  size: number;
  parent: TrieNode | null;
  children: Map<string, TrieNode> | null;
  isLeaf: boolean;

  constructor() {
    this.key = null;
    this.label = null;
    this.size = 0;
    this.parent = null;
    this.children = null;
    this.isLeaf = false;
  }
}