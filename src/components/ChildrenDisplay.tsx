import { useTree } from './TreeProvider';
import { useUser } from './UserProvider';

const ChildrenDisplay = () => {
  const { currentNode } = useTree();
  const { navigateToNode } = useUser();

  if (!currentNode) {
    return <div className="children-display" />;
  }

  const children = currentNode.children;

  return (
    <div className="children-display">
      {children.length > 0 && (
        <>
          {/* <h3 className="children-display-title">Children</h3> */}
          <div className="children-display-list">
            {children.map((child, index) => (
              <button
                key={child.id}
                className="children-display-item children-enter"
                onClick={() => navigateToNode(child.id)}
                style={{ animationDelay: `${1 + (index * 0.1)}s` }}
              >
                {child.data.text}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChildrenDisplay;

