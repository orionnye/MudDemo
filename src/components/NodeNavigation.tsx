import { useUser } from './UserProvider';
import { useEffect, useRef } from 'react';

const NodeNavigation = () => {
  const { user, navigateBack } = useUser();
  const historyEndRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const history = user.navigationHistory;

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (containerRef.current && history.length > 0) {
      const scrollToBottom = () => {
        const container = containerRef.current;
        if (!container) return;

        // Calculate the maximum scroll position
        const maxScroll = container.scrollHeight - container.clientHeight;
        
        // Only scroll if content exceeds viewport
        if (maxScroll > 0) {
          // Try scrollTo first
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });

          // Fallback: Use scrollIntoView on the most recent item if it exists
          if (historyEndRef.current) {
            setTimeout(() => {
              historyEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
              });
            }, 50);
          }
        }
      };

      // Wait for DOM updates and animations to complete
      const timeoutId = setTimeout(() => {
        // Multiple frames to ensure layout is stable
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // One more frame for good measure when becoming scrollable
            requestAnimationFrame(() => {
              scrollToBottom();
            });
          });
        });
      }, 200); // Increased delay to account for animation

      return () => clearTimeout(timeoutId);
    }
  }, [history.length, history]);

  // Always render the component to see if it's there, even if empty
  return (
    <div className="node-navigation" ref={containerRef}>
      {history.length > 0 && (
        <div className="node-navigation-section">
          {/* <h3 className="node-navigation-title">History</h3> */}
          <div className="node-navigation-list">
            {history.map((node, index) => {
              const isMostRecent = index === history.length - 1;
              return isMostRecent ? (
                <button
                  key={`${node.id}-${index}`}
                  ref={historyEndRef}
                  className="node-navigation-item node-navigation-history node-navigation-recent node-history-enter"
                  onClick={navigateBack}
                >
                  {node.data.text}
                </button>
              ) : (
                <div
                  key={`${node.id}-${index}`}
                  className="node-navigation-item node-navigation-history node-navigation-past"
                >
                  {node.data.text}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {history.length === 0 && (
        <div className="node-navigation-section">
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
            No navigation history yet. Navigate to see your path.
          </p>
        </div>
      )}
    </div>
  );
};

export default NodeNavigation;

