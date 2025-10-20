import { useEffect, useRef, memo } from 'react';

const MatrixRain = memo(() => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const parent = canvas.parentElement;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      // Reinitialize drops on resize
      const columns = Math.floor(canvas.width / fontSize);
      drops.length = columns;
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -(canvas.height / fontSize);
      }
    };

    // Matrix rain characters - optimized set
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const drops = [];

    resizeCanvas();

    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };
    window.addEventListener('resize', handleResize);

    // Cache accent color
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-color')
      .trim() || '#00FF9C';

    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    // Optimized animation function
    const draw = (currentTime) => {
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= interval) {
        lastTime = currentTime - (deltaTime % interval);

        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(10, 15, 24, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text color
        ctx.fillStyle = accentColor;
        ctx.font = `${fontSize}px monospace`;

        // Draw characters
        const len = drops.length;
        for (let i = 0; i < len; i++) {
          const text = characters[Math.floor(Math.random() * characters.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillText(text, x, y);

          // Reset drop to top randomly
          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none"
      style={{ willChange: 'auto' }}
    />
  );
});

MatrixRain.displayName = 'MatrixRain';

export default MatrixRain;

