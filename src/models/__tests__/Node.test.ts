import { describe, it, expect } from 'vitest';
import { Node } from '../Node';
import { NodeData } from '../../types/node';

describe('Node', () => {
  const createNodeData = (id: string, text: string): NodeData => ({
    id,
    text,
  });

  it('should create a node with data', () => {
    const data = createNodeData('node1', 'Test node');
    const node = new Node(data);

    expect(node.id).toBe('node1');
    expect(node.data.text).toBe('Test node');
  });

  it('should add a child node', () => {
    const parent = new Node(createNodeData('parent', 'Parent'));
    const child = new Node(createNodeData('child', 'Child'));

    parent.addChild(child);

    expect(parent.children).toHaveLength(1);
    expect(parent.children[0].id).toBe('child');
    expect(child.parent?.id).toBe('parent');
  });

  it('should get all parents', () => {
    const root = new Node(createNodeData('root', 'Root'));
    const level1 = new Node(createNodeData('level1', 'Level 1'));
    const level2 = new Node(createNodeData('level2', 'Level 2'));

    root.addChild(level1);
    level1.addChild(level2);

    const parents = level2.getAllParents();
    expect(parents).toHaveLength(2);
    expect(parents[0].id).toBe('root');
    expect(parents[1].id).toBe('level1');
  });
});

