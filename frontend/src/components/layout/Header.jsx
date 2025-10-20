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
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  }, [location, mobileMenuOpen]);

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
        <nav className="flex items-center justify-center py-3 relative">
          {/* Logo with enhanced styling - Positioned absolutely on left */}
          <Link
            to="/"
            className="group flex items-center gap-2 text-2xl font-bold title-font text-accent tracking-wider hover:text-accent transition-all duration-300 absolute left-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-lg flex items-center justify-center border border-accent-color/30 shadow-lg group-hover:shadow-accent-color/30 transition-all duration-300 group-hover:scale-110">
              <i className="fas fa-shield-alt text-accent-color text-lg"></i>
            </div>
            <GlitchText text="MrAashish0x1" className="text-2xl font-bold text-accent-color font-mono" />
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

          {/* Mobile Menu Button - Enhanced */}
          <button
            className="md:hidden relative z-[10001] w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-accent-color/30 bg-accent-color/10 hover:bg-accent-color/20 transition-all duration-300 hover:shadow-lg hover:shadow-accent-color/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-accent-color rounded transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`w-5 h-0.5 bg-accent-color rounded transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`w-5 h-0.5 bg-accent-color rounded transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Panel - Enhanced */}
      <div
        className={`fixed top-0 right-0 w-80 h-screen bg-primary-bg/98 backdrop-blur-xl shadow-2xl shadow-accent-color/10 transition-transform duration-500 ease-in-out z-[10000] md:hidden border-l border-accent-color/30 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile menu header */}
        <div className="pt-6 px-6 pb-4 border-b border-accent-color/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-lg flex items-center justify-center border border-accent-color/30 shadow-lg">
              <i className="fas fa-shield-alt text-accent-color text-lg"></i>
            </div>
            <div>
              <p className="text-accent-color font-mono font-bold text-lg">MrAashish0x1</p>
              <p className="text-text-secondary text-xs font-mono">Navigation Menu</p>
            </div>
          </div>
        </div>

        <ul className="pt-6 px-4">
          {navLinks.map((link, index) => (
            <li key={link.path} className="mb-2" style={{ animationDelay: `${index * 50}ms` }}>
              <Link
                to={link.path}
                data-text={link.label}
                className={`nav-link-glitch group block px-6 py-4 font-secondary text-lg rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive(link.path)
                    ? 'text-accent-color bg-accent-color/20 shadow-lg shadow-accent-color/20 border border-accent-color/40'
                    : 'text-text-primary hover:text-accent-color hover:bg-accent-color/10 border border-transparent hover:border-accent-color/20'
                }`}
              >
                <span className="relative z-10 flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    {link.label}
                    {isActive(link.path) && (
                      <span className="inline-block w-2 h-2 bg-accent-color rounded-full animate-pulse"></span>
                    )}
                  </span>
                  <i className="fas fa-chevron-right text-sm opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
                </span>
                {/* Hover effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-color/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-accent-color/20 bg-secondary-bg/50 backdrop-blur-md">
          <p className="text-xs text-text-secondary font-mono text-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
            System Active • Secure Connection
          </p>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;

