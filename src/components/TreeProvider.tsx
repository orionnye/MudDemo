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

const TreeProvider = ({ children }: TreeProviderProps) => {
  const [tree] = useState<Tree>(() => {
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

    const room5 = newTree.addNode(
      {
        id: 'room5',
        text: 'You enter a magical workshop. Strange artifacts hum with energy on workbenches. A glowing crystal pulses in the center.',
      },
      room3.id
    );

    const room6 = newTree.addNode(
      {
        id: 'room6',
        text: 'A narrow passageway leads deeper underground. The walls are covered in ancient runes that seem to shift and move.',
      },
      room1.id
    );

    const room7 = newTree.addNode(
      {
        id: 'room7',
        text: 'You discover a hidden chamber with a massive stone door. Mysterious symbols are carved into its surface. It feels significant.',
      },
      room4.id
    );

    const room8 = newTree.addNode(
      {
        id: 'room8',
        text: 'A crystal garden spreads before you. Gemstones of every color grow like plants, casting prismatic light across the walls.',
      },
      room5.id
    );

    const room9 = newTree.addNode(
      {
        id: 'room9',
        text: 'You reach a circular chamber with a pit in the center. Strange chanting echoes from below. Something ancient stirs.',
      },
      room6.id
    );

    const room10 = newTree.addNode(
      {
        id: 'room10',
        text: 'An altar room awaits. Ancient candles burn with an eternal flame. The air itself seems to vibrate with power.',
      },
      room7.id
      );

    return newTree;
  });

  const [currentNode, setCurrentNodeState] = useState<Node | null>(() => tree.root);
  const navigationSourceRef = useRef<'forward' | 'backtrack' | null>(null);

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

