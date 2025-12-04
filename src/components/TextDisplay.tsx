import { useState, useEffect } from 'react';

interface TextDisplayProps {
  text: string;
  isBacktracking?: boolean;
}

const TextDisplay = ({ text, isBacktracking = false }: TextDisplayProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isExiting, setIsExiting] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    if (text !== displayText) {
      // Store direction based on backtracking flag
      setDirection(isBacktracking ? 'backward' : 'forward');
      
      // Start exit animation
      setIsExiting(true);
      
      // After exit animation completes, update text and start enter animation
      const timer = setTimeout(() => {
        setDisplayText(text);
        setIsExiting(false);
      }, 400); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [text, isBacktracking]);

  const animationClass = isExiting 
    ? (direction === 'backward' ? 'text-exit-down' : 'text-exit-up')
    : (direction === 'backward' ? 'text-enter-down' : 'text-enter-up');

  return (
    <div className="text-display-box">
      <div className="text-display-content">
        <p 
          key={displayText}
          className={`text-display-text ${animationClass}`}
        >
          {displayText}
        </p>
      </div>
    </div>
  );
};

export default TextDisplay;

