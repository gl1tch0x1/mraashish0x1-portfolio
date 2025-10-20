import { useState, useEffect, memo } from 'react';

const TextScramble = memo(({ 
  text = 'LOADING...', 
  className = '',
  scrambleSpeed = 50,
  revealSpeed = 100,
  characters = '!<>-_\\/[]{}—=+*^?#________'
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(true);

  useEffect(() => {
    let frame = 0;
    const queue = [];
    const frameRequest = { current: null };

    // Initialize queue with random reveal times
    for (let i = 0; i < text.length; i++) {
      const from = text[i];
      const to = text[i];
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end });
    }

    const update = () => {
      let output = '';
      let complete = 0;

      for (let i = 0; i < queue.length; i++) {
        let { from, to, start, end, char } = queue[i];

        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = characters[Math.floor(Math.random() * characters.length)];
            queue[i].char = char;
          }
          output += `<span class="text-accent-color/60">${char}</span>`;
        } else {
          output += from;
        }
      }

      setDisplayText(output);

      if (complete === queue.length) {
        setIsScrambling(false);
        return;
      }

      frame++;
      frameRequest.current = requestAnimationFrame(update);
    };

    frameRequest.current = requestAnimationFrame(update);

    return () => {
      if (frameRequest.current) {
        cancelAnimationFrame(frameRequest.current);
      }
    };
  }, [text, characters]);

  return (
    <span 
      className={`font-mono ${className}`}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  );
});

TextScramble.displayName = 'TextScramble';

export default TextScramble;

