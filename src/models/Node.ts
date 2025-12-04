import { NodeData } from '../types/node';

export class Node {
  private _data: NodeData;
  private _parent: Node | null = null;
  private _children: Node[] = [];

  constructor(data: NodeData) {
    this._data = data;
  }

  get data(): NodeData {
    return this._data;
  }

  set data(data: NodeData) {
    this._data = data;
  }

  get parent(): Node | null {
    return this._parent;
  }

  get children(): Node[] {
    return [...this._children];
  }

  get id(): string {
    return this._data.id;
  }

  addChild(child: Node): void {
    if (child._parent !== null) {
      child._parent.removeChild(child);
    }
    child._parent = this;
    this._children.push(child);
  }

  removeChild(child: Node): boolean {
    const index = this._children.indexOf(child);
    if (index === -1) {
      return false;
    }
    this._children.splice(index, 1);
    child._parent = null;
    return true;
  }

  removeAllChildren(): void {
    this._children.forEach((child) => {
      child._parent = null;
    });
    this._children = [];
  }

  hasChild(child: Node): boolean {
    return this._children.includes(child);
  }

  getChildById(id: string): Node | undefined {
    return this._children.find((child) => child.id === id);
  }

  getSiblings(): Node[] {
    if (this._parent === null) {
      return [];
    }
    return this._parent._children.filter((child) => child !== this);
  }

  getDepth(): number {
    if (this._parent === null) {
      return 0;
    }
    return this._parent.getDepth() + 1;
  }

  isRoot(): boolean {
    return this._parent === null;
  }

  isLeaf(): boolean {
    return this._children.length === 0;
  }

  getAllParents(): Node[] {
    const parents: Node[] = [];
    let current: Node | null = this._parent;
    while (current !== null) {
      parents.unshift(current);
      current = current._parent;
    }
    return parents;
  }
}

