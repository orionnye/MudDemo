import TreeProvider from './components/TreeProvider';
import UserProvider from './components/UserProvider';
import HealthBanner from './components/HealthBanner';
import TextDisplay from './components/TextDisplay';
import NodeNavigation from './components/NodeNavigation';
import ChildrenDisplay from './components/ChildrenDisplay';
import { useUser } from './components/UserProvider';
import { useTree } from './components/TreeProvider';

const AppContent = () => {
  const { user, isBacktracking } = useUser();
  const { tree } = useTree();

  const handleExportTree = () => {
    const treeJSON = tree.toJSON();
    const jsonString = JSON.stringify(treeJSON, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dungeon-tree.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <HealthBanner />
      <div className="app-content">
        <div className="app-column-left">
          <div className="card">
            <h2>Left Column</h2>
            <p>Content area (30%)</p>
            <button 
              onClick={handleExportTree}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#252529',
                border: '1px solid #3a3a44',
                color: '#d4d4d8',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#34343d';
                e.currentTarget.style.borderColor = '#4a4a54';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#252529';
                e.currentTarget.style.borderColor = '#3a3a44';
              }}
            >
              Export Tree to JSON
            </button>
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

