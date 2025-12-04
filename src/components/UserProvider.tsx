import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { useTree } from './TreeProvider';

interface UserContextType {
  user: User;
  setUser: (user: User | ((prevUser: User) => User)) => void;
  incrementHealth: () => void;
  navigateToNode: (nodeId: string) => void;
  navigateBack: () => void;
  isBacktracking: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const { tree, currentNode, setCurrentNode } = useTree();
  const [user, setUser] = useState<User>({
    health: 100,
    text: '',
    navigationHistory: [],
    wisdom: 4,
  });
  const [isBacktracking, setIsBacktracking] = useState(false);

  // Initialize text from current node on mount
  useEffect(() => {
    if (currentNode && !user.text) {
      setUser((prevUser) => ({
        ...prevUser,
        text: currentNode.data.text,
      }));
    }
  }, [currentNode, user.text]);

  // Navigate forward - add previous node to history when exiting it
  const navigateToNode = (nodeId: string) => {
    const node = tree.getNodeById(nodeId);
    if (!node) return;

    // Don't navigate if we're already at this node
    if (currentNode?.id === nodeId) {
      return;
    }

    // Set backtracking flag to false for forward navigation
    setIsBacktracking(false);

    // Store the node we're leaving before navigation
    const nodeBeingExited = currentNode;

    setUser((prevUser) => {
      // Create a new history array from previous history
      let history = [...prevUser.navigationHistory];
      
      // Add the node we're EXITING to history (not the one we're entering)
      if (nodeBeingExited) {
        // Check if node is already in history - don't add duplicates
        const isDuplicate = history.some((n) => n.id === nodeBeingExited.id);
        
        if (!isDuplicate) {
          // Check if history length >= wisdom, remove oldest if so
          if (history.length >= prevUser.wisdom) {
            history.shift(); // Remove oldest node
          }
          
          // Add the node we're leaving to history
          history.push(nodeBeingExited);
        }
      }

      return {
        ...prevUser,
        text: node.data.text,
        navigationHistory: history,
      };
    });

    // Update tree's current node
    setCurrentNode(node);
  };

  // Navigate back - remove most recent from history and navigate to it
  const navigateBack = () => {
    setUser((prevUser) => {
      const history = [...prevUser.navigationHistory];
      
      if (history.length === 0) return prevUser;

      // Set backtracking flag to true
      setIsBacktracking(true);

      // Remove the most recent node from history
      const backNode = history.pop()!;

      // Update tree's current node
      setCurrentNode(backNode);

      // Reset backtracking flag after animation completes
      setTimeout(() => setIsBacktracking(false), 500);

      return {
        ...prevUser,
        text: backNode.data.text,
        navigationHistory: history,
      };
    });
  };

  const incrementHealth = () => {
    setUser((prevUser) => ({
      ...prevUser,
      health: prevUser.health + 1,
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, incrementHealth, navigateToNode, navigateBack, isBacktracking }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;

