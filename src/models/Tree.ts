import { Node } from './Node';
import { NodeData } from '../types/node';

export class Tree {
  private _root: Node | null = null;
  private _nodes: Map<string, Node> = new Map();

  constructor(rootData?: NodeData) {
    if (rootData) {
      this.setRoot(rootData);
    }
  }

  get root(): Node | null {
    return this._root;
  }

  setRoot(data: NodeData): Node {
    const node = new Node(data);
    this._root = node;
    this._nodes.set(node.id, node);
    return node;
  }

  getNodeById(id: string): Node | undefined {
    return this._nodes.get(id);
  }

  addNode(data: NodeData, parentId?: string): Node {
    const node = new Node(data);
    this._nodes.set(node.id, node);

    if (parentId) {
      const parent = this._nodes.get(parentId);
      if (parent) {
        parent.addChild(node);
      }
    } else if (this._root) {
      this._root.addChild(node);
    } else {
      this._root = node;
    }

    return node;
  }

  removeNode(id: string): boolean {
    const node = this._nodes.get(id);
    if (!node) {
      return false;
    }

    if (node.isRoot()) {
      this._root = null;
    } else if (node.parent) {
      node.parent.removeChild(node);
    }

    node.removeAllChildren();
    this._nodes.delete(id);
    return true;
  }

  getAllNodes(): Node[] {
    return Array.from(this._nodes.values());
  }

  traverse(callback: (node: Node) => void, startNode?: Node): void {
    const node = startNode || this._root;
    if (!node) {
      return;
    }

    callback(node);
    node.children.forEach((child) => {
      this.traverse(callback, child);
    });
  }

  find(predicate: (node: Node) => boolean): Node | undefined {
    for (const node of this._nodes.values()) {
      if (predicate(node)) {
        return node;
      }
    }
    return undefined;
  }

  findAll(predicate: (node: Node) => boolean): Node[] {
    const results: Node[] = [];
    for (const node of this._nodes.values()) {
      if (predicate(node)) {
        results.push(node);
      }
    }
    return results;
  }

  getPathToNode(id: string): Node[] | null {
    const node = this._nodes.get(id);
    if (!node) {
      return null;
    }

    const path: Node[] = [];
    let current: Node | null = node;
    while (current !== null) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }
}

