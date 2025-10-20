import { useEffect, useRef, memo } from 'react';

const MatrixRain = memo(() => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const parent = canvas.parentElement;

    // Detect mobile devices for performance optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    // Adjust font size and FPS based on device
    const fontSize = isMobile ? 16 : 14; // Larger font on mobile for better performance
    const targetFPS = isMobile ? 20 : 30; // Lower FPS on mobile to save battery

    // Set canvas size
    const resizeCanvas = () => {
      // Use device pixel ratio for sharper rendering, but limit on mobile
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';

      ctx.scale(dpr, dpr);

      // Reinitialize drops on resize
      const columns = Math.floor(rect.width / fontSize);
      drops.length = columns;
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -(rect.height / fontSize);
      }
    };

    // Matrix rain characters - optimized set
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
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
    const interval = 1000 / targetFPS;

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

