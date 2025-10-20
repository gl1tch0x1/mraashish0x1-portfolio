import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlitchText from '../effects/GlitchText';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

    // Handle Escape key to close menu
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-[1001] transition-all duration-300 ${
        scrolled
          ? 'bg-secondary-bg/90 backdrop-blur-xl shadow-lg shadow-accent-color/10 border-accent-color/30'
          : 'bg-secondary-bg/85 backdrop-blur-md border-border'
      } border-b`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between md:justify-center py-3 relative">
          {/* Logo with enhanced styling - Left aligned on mobile, absolute on desktop */}
          <Link
            to="/"
            className="group flex items-center gap-2 text-xl sm:text-2xl font-bold title-font text-accent tracking-wider hover:text-accent transition-all duration-300 md:absolute md:left-0 z-[10002]"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-lg flex items-center justify-center border border-accent-color/30 shadow-lg group-hover:shadow-accent-color/30 transition-all duration-300 group-hover:scale-110">
              <i className="fas fa-shield-alt text-accent-color text-base sm:text-lg"></i>
            </div>
            <span className="hidden sm:inline">
              <GlitchText text="MrAashish0x1" className="text-xl sm:text-2xl font-bold text-accent-color font-mono" />
            </span>
            <span className="sm:hidden text-accent-color font-mono text-lg">MrAashish0x1</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <ul className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  data-text={link.label}
                  className={`nav-link-glitch group font-secondary transition-all duration-300 px-4 py-2 rounded-lg relative overflow-hidden ${
                    isActive(link.path)
                      ? 'text-accent-color bg-accent-color/15 shadow-lg shadow-accent-color/20 border border-accent-color/30'
                      : 'text-text-primary hover:text-accent-color hover:bg-accent-color/10 border border-transparent hover:border-accent-color/20'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                    {isActive(link.path) && (
                      <span className="inline-block w-1.5 h-1.5 bg-accent-color rounded-full animate-pulse"></span>
                    )}
                  </span>
                  {/* Hover glow effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-color/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {/* Underline effect */}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-accent-color transition-all duration-300 group-hover:w-3/4 shadow-[0_0_8px_rgba(var(--accent-color-rgb),0.7)]"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button - Enhanced with Accessibility */}
          <button
            className="md:hidden relative z-[10002] w-11 h-11 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span
              className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`w-5 h-0.5 bg-white rounded transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Panel - Simplified & Clean (Full-screen, 100% Opaque) */}
      <nav
        id="mobile-navigation"
        className={`fixed top-0 right-0 w-screen h-screen transition-transform duration-300 ease-in-out z-[10001] md:hidden border-l-2 border-accent-color ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: '#0a0f18',
        }}
        aria-label="Mobile navigation"
        role="navigation"
      >
        {/* Mobile menu header */}
        <div className="pt-6 px-6 pb-4 border-b border-accent-color/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-accent-color/50 bg-accent-color/10">
              <i className="fas fa-shield-alt text-accent-color text-lg"></i>
            </div>
            <div>
              <p className="text-white font-mono font-bold text-lg">MrAashish0x1</p>
              <p className="text-accent-color text-xs font-mono">Navigation</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="pt-6 px-4">
          {navLinks.map((link) => (
            <li key={link.path} className="mb-2">
              <Link
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-5 py-3.5 font-mono text-base font-semibold rounded-lg transition-all duration-200 min-h-[48px] flex items-center justify-between ${
                  isActive(link.path)
                    ? 'text-white bg-accent-color/20 border border-accent-color/60'
                    : 'text-white hover:text-white hover:bg-accent-color/10 border border-transparent hover:border-accent-color/40'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {isActive(link.path) && (
                    <span className="inline-block w-1.5 h-1.5 bg-accent-color rounded-full"></span>
                  )}
                </span>
                <i className="fas fa-chevron-right text-xs text-accent-color/60"></i>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Overlay - 100% Opaque, blocks all content */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[10000] md:hidden cursor-pointer"
          style={{ backgroundColor: '#0a0f18' }}
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setMobileMenuOpen(false);
            }
          }}
          role="button"
          aria-hidden="true"
          tabIndex={0}
          aria-label="Close navigation menu"
        ></div>
      )}
    </header>
  );
};

export default Header;

