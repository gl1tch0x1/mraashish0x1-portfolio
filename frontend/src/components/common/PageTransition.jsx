import { useState, useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';
import TextScramble from '../effects/TextScramble';

const PageTransition = memo(({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, location]);

  const getPageName = (pathname) => {
    const routes = {
      '/': 'HOME',
      '/about': 'ABOUT',
      '/skills': 'SKILLS',
      '/services': 'SERVICES',
      '/projects': 'PROJECTS',
      '/contact': 'CONTACT',
      '/sec/admin': 'ADMIN_LOGIN',
      '/sec/admin/dashboard': 'ADMIN_DASHBOARD'
    };
    return routes[pathname] || 'LOADING';
  };

  return (
    <>
      {/* Page Transition Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-primary-bg transition-opacity duration-300 pointer-events-none ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          pointerEvents: isTransitioning ? 'all' : 'none'
        }}
      >
        <div className="text-center">
          {/* Scrambled Text */}
          <div className="text-4xl md:text-6xl font-mono text-accent-color mb-4">
            <TextScramble text={getPageName(location.pathname)} />
          </div>
          
          {/* Loading Bar */}
          <div className="w-64 h-1 bg-secondary-bg rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-accent-color rounded-full transition-all duration-500"
              style={{
                width: isTransitioning ? '100%' : '0%',
                boxShadow: '0 0 10px rgba(0, 255, 156, 0.5)'
              }}
            />
          </div>

          {/* Glitch Effect Lines */}
          <div className="mt-8 space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-px bg-accent-color/30 mx-auto animate-pulse"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
});

PageTransition.displayName = 'PageTransition';

export default PageTransition;

