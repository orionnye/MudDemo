import TreeProvider from './components/TreeProvider';
import UserProvider from './components/UserProvider';
import HealthBanner from './components/HealthBanner';
import TextDisplay from './components/TextDisplay';
import NodeNavigation from './components/NodeNavigation';
import ChildrenDisplay from './components/ChildrenDisplay';
import { useUser } from './components/UserProvider';

const AppContent = () => {
  const { user, isBacktracking } = useUser();

  return (
    <div className="app">
      <HealthBanner />
      <div className="app-content">
        <div className="app-column-left">
          <div className="card">
            <h2>Left Column</h2>
            <p>Content area (30%)</p>
          </div>
        </div>
        <div className="app-column-right">
          <NodeNavigation />
          <TextDisplay text={user.text} isBacktracking={isBacktracking} />
          <ChildrenDisplay />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <TreeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </TreeProvider>
  );
};

export default App;

