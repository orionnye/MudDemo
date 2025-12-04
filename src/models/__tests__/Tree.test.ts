import { describe, it, expect } from 'vitest';
import { Tree } from '../Tree';
import { NodeData } from '../../types/node';

describe('Tree', () => {
  it('should create a tree with a root', () => {
    const tree = new Tree();
    const rootData: NodeData = { id: 'root', text: 'Root node' };
    const root = tree.setRoot(rootData);

    expect(tree.root).toBe(root);
    expect(root.id).toBe('root');
  });

  it('should add nodes to the tree', () => {
    const tree = new Tree();
    const root = tree.setRoot({ id: 'root', text: 'Root' });
    const node1 = tree.addNode({ id: 'node1', text: 'Node 1' }, root.id);

    expect(tree.getNodeById('node1')).toBe(node1);
    expect(root.children).toHaveLength(1);
    expect(root.children[0].id).toBe('node1');
  });

  it('should find nodes by ID', () => {
    const tree = new Tree();
    tree.setRoot({ id: 'root', text: 'Root' });
    tree.addNode({ id: 'node1', text: 'Node 1' }, 'root');

    const found = tree.getNodeById('node1');
    expect(found?.id).toBe('node1');
    expect(tree.getNodeById('nonexistent')).toBeUndefined();
  });

  it('should traverse the tree', () => {
    const tree = new Tree();
    const root = tree.setRoot({ id: 'root', text: 'Root' });
    tree.addNode({ id: 'node1', text: 'Node 1' }, root.id);
    tree.addNode({ id: 'node2', text: 'Node 2' }, root.id);

    const visited: string[] = [];
    tree.traverse((node) => {
      visited.push(node.id);
    });

    expect(visited).toContain('root');
    expect(visited).toContain('node1');
    expect(visited).toContain('node2');
  });
});

