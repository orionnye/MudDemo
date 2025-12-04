import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Tree } from '../models/Tree';
import { Node } from '../models/Node';

interface TreeContextType {
  tree: Tree;
  currentNode: Node | null;
  setCurrentNode: (node: Node | null) => void;
  navigateToNode: (nodeId: string, isBacktrack?: boolean) => void;
  navigationSourceRef: React.MutableRefObject<'forward' | 'backtrack' | null>;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

interface TreeProviderProps {
  children: ReactNode;
}

const createDefaultTree = (): Tree => {
  const newTree = new Tree();
    
    // Initialize tree with sample nodes containing text data
    const rootNode = newTree.setRoot({
      id: 'root',
      text: 'Welcome to Mud Demo! You find yourself at the entrance of an ancient dungeon. The air is thick with mystery.',
    });

    const room1 = newTree.addNode(
      {
        id: 'room1',
        text: 'You enter a dimly lit chamber. Torches flicker on the walls, casting eerie shadows. There are two corridors ahead.',
      },
      rootNode.id
    );

    const room2 = newTree.addNode(
      {
        id: 'room2',
        text: 'You step into a treasure room! Gold coins glitter in the torchlight. However, the door behind you closes with a loud thud.',
      },
      room1.id
    );

    const room3 = newTree.addNode(
      {
        id: 'room3',
        text: 'You find yourself in a library filled with ancient tomes. The books seem to whisper secrets in an unknown language.',
      },
      room1.id
    );

    const room4 = newTree.addNode(
      {
        id: 'room4',
        text: 'A dusty armory lies before you. Old weapons line the walls, some rusted, others still gleaming in the dim light.',
      },
      room2.id
    );

    return newTree;
};

const TreeProvider = ({ children }: TreeProviderProps) => {
  const defaultTree = createDefaultTree();
  const [tree, setTree] = useState<Tree>(defaultTree);
  const [currentNode, setCurrentNodeState] = useState<Node | null>(defaultTree.root);
  const navigationSourceRef = useRef<'forward' | 'backtrack' | null>(null);

  // Load tree from JSON file on mount
  useEffect(() => {
    const loadTreeFromJSON = async () => {
      try {
        const response = await fetch('/dungeon-tree.json');
        if (response.ok) {
          const jsonData = await response.json();
          const loadedTree = Tree.fromJSON(jsonData);
          setTree(loadedTree);
          setCurrentNodeState(loadedTree.root);
        } else {
          console.warn('Failed to fetch dungeon-tree.json, using default tree');
        }
      } catch (error) {
        console.warn('Failed to load tree from JSON, using default:', error);
      }
    };

    loadTreeFromJSON();
  }, []);

  const setCurrentNode = (node: Node | null) => {
    navigationSourceRef.current = 'forward';
    setCurrentNodeState(node);
  };

  const navigateToNode = (nodeId: string, isBacktrack = false) => {
    const node = tree.getNodeById(nodeId);
    if (node) {
      navigationSourceRef.current = isBacktrack ? 'backtrack' : 'forward';
      setCurrentNodeState(node);
    }
  };

  return (
    <TreeContext.Provider value={{ tree, currentNode, setCurrentNode, navigateToNode, navigationSourceRef }}>
      {children}
    </TreeContext.Provider>
  );
};

export const useTree = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

export default TreeProvider;

