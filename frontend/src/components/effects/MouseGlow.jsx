import { useEffect, useState, memo } from 'react';

const MouseGlow = memo(() => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Hide glow when mouse stops moving
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {/* Main cursor glow */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-300"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 0.4 : 0,
        }}
      >
        <div
          className="w-32 h-32 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 156, 0.15) 0%, rgba(0, 255, 156, 0.05) 40%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Secondary glow (smaller, more intense) */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-200"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 0.6 : 0,
        }}
      >
        <div
          className="w-8 h-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 156, 0.3) 0%, rgba(0, 255, 156, 0.1) 50%, transparent 100%)',
            filter: 'blur(8px)',
          }}
        />
      </div>

      {/* Cursor dot */}
      <div
        className="fixed pointer-events-none z-50 transition-opacity duration-100"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className="w-1 h-1 rounded-full bg-accent-color"
          style={{
            boxShadow: '0 0 4px rgba(0, 255, 156, 0.8)',
          }}
        />
      </div>
    </>
  );
});

MouseGlow.displayName = 'MouseGlow';

export default MouseGlow;

