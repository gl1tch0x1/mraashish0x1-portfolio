import { useState, useEffect } from 'react';

const Loader = () => {
  const [text, setText] = useState('LOADING...');
  const [scrambleIndex, setScrambleIndex] = useState(0);
  
  const phrases = [
    'INITIATING_SEQUENCE...',
    'ACCESSING_DATA_GRID...',
    'RENDERING_INTERFACE...',
    'SYSTEM_READY.'
  ];
  
  const chars = '!<>-_\\/[]{}—=+*^?#';

  useEffect(() => {
    let currentPhrase = 0;
    let currentChar = 0;
    let isScrambling = true;

    const scrambleInterval = setInterval(() => {
      if (isScrambling && currentChar < phrases[currentPhrase].length) {
        const scrambled = phrases[currentPhrase]
          .split('')
          .map((char, index) => {
            if (index < currentChar) {
              return char;
            } else if (index === currentChar) {
              return chars[Math.floor(Math.random() * chars.length)];
            }
            return char;
          })
          .join('');
        
        setText(scrambled);
        
        if (Math.random() > 0.7) {
          currentChar++;
        }
      } else if (currentChar >= phrases[currentPhrase].length) {
        setText(phrases[currentPhrase]);
        isScrambling = false;
        
        setTimeout(() => {
          currentPhrase = (currentPhrase + 1) % phrases.length;
          currentChar = 0;
          isScrambling = true;
        }, 200);
      }
    }, 50);

    return () => clearInterval(scrambleInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-primary-bg/98 z-[10002] flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-secondary text-accent animate-pulse">
          {text}
        </div>
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

