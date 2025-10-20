import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomContextMenu = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const menuItems = [
    { icon: 'fas fa-home', label: 'Home', path: '/' },
    { icon: 'fas fa-user', label: 'About', path: '/about' },
    { icon: 'fas fa-code', label: 'Skills', path: '/skills' },
    { icon: 'fas fa-briefcase', label: 'Services', path: '/services' },
    { icon: 'fas fa-project-diagram', label: 'Projects', path: '/projects' },
    { icon: 'fas fa-envelope', label: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: 'fab fa-github', label: 'GitHub', url: 'https://github.com/MrAashish0x1' },
    { icon: 'fab fa-linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/MrAashish0x1' },
    { icon: 'fab fa-telegram', label: 'Telegram', url: 'https://t.me/MrAashish0x1' },
    { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://instagram.com/MrAashish0x1' },
  ];

  useEffect(() => {
    const handleContextMenu = (e) => {
      // Only show on desktop (screen width > 768px)
      if (window.innerWidth <= 768) return;

      e.preventDefault();

      const menuWidth = 250;
      const menuHeight = 450;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate position with viewport bounds checking
      let x = e.clientX;
      let y = e.clientY;

      // Adjust if menu would go off right edge
      if (x + menuWidth > viewportWidth) {
        x = viewportWidth - menuWidth - 10;
      }

      // Adjust if menu would go off bottom edge
      if (y + menuHeight > viewportHeight) {
        y = viewportHeight - menuHeight - 10;
      }

      setPosition({ x, y });
      setIsVisible(true);
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    const handleScroll = () => {
      setIsVisible(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsVisible(false);
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-[9999] bg-secondary-bg border-2 border-accent-color/30 rounded-lg shadow-2xl overflow-hidden backdrop-blur-md"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '250px',
        boxShadow: '0 0 30px rgba(0, 255, 156, 0.2), 0 10px 40px rgba(0, 0, 0, 0.5)',
        animation: 'contextMenuFadeIn 0.2s ease-out',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-color/10 to-accent-color/5 px-4 py-3 border-b border-accent-color/20">
        <div className="flex items-center gap-2">
          <i className="fas fa-terminal text-accent-color text-sm"></i>
          <span className="text-accent-color font-mono text-sm font-semibold tracking-wider">
            QUICK_ACCESS
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="py-2">
        <div className="px-3 py-1 text-xs font-mono text-text-secondary uppercase tracking-wider">
          Navigation
        </div>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-accent-color/10 transition-all duration-200 group border-l-2 border-transparent hover:border-accent-color"
          >
            <i className={`${item.icon} text-accent-color/60 group-hover:text-accent-color transition-colors w-4 text-center`}></i>
            <span className="text-text-primary group-hover:text-accent-color font-mono text-sm transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-accent-color/20 mx-3 my-2"></div>

      {/* Social Links Section */}
      <div className="py-2">
        <div className="px-3 py-1 text-xs font-mono text-text-secondary uppercase tracking-wider">
          Social Links
        </div>
        {socialLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => handleSocialClick(link.url)}
            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-accent-color/10 transition-all duration-200 group border-l-2 border-transparent hover:border-accent-color"
          >
            <i className={`${link.icon} text-accent-color/60 group-hover:text-accent-color transition-colors w-4 text-center`}></i>
            <span className="text-text-primary group-hover:text-accent-color font-mono text-sm transition-colors">
              {link.label}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-accent-color/5 to-accent-color/10 px-4 py-2 border-t border-accent-color/20">
        <div className="text-xs font-mono text-text-secondary text-center">
          Right-click anywhere
        </div>
      </div>
    </div>
  );
});

CustomContextMenu.displayName = 'CustomContextMenu';

export default CustomContextMenu;

