import { useState, useEffect } from 'react';

const GlitchText = ({ text, className = '', interval = 3000 }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchChars = '!<>-_\\/[]{}—=+*^?#@$%&';
    
    const glitch = () => {
      setIsGlitching(true);
      let iterations = 0;
      const maxIterations = 10;
      
      const glitchInterval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iterations) {
                return text[index];
              }
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('')
        );
        
        iterations += 1;
        
        if (iterations > maxIterations) {
          clearInterval(glitchInterval);
          setDisplayText(text);
          setIsGlitching(false);
        }
      }, 50);
    };

    const timer = setInterval(glitch, interval);
    
    return () => {
      clearInterval(timer);
    };
  }, [text, interval]);

  return (
    <span className={`${className} ${isGlitching ? 'glitch-active' : ''}`}>
      {displayText}
    </span>
  );
};

export default GlitchText;

