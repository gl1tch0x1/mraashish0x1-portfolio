import { useQuery } from '@tanstack/react-query';
import { aboutAPI } from '../../services/api';

const Footer = () => {
  const { data: aboutData } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const response = await aboutAPI.get();
      return response.data.data;
    },
  });

  const socialLinks = aboutData?.socialLinks || {};

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-bg/90 backdrop-blur-md border-t border-accent-color/30 py-8 mt-16 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent-color/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Social Links - Enhanced */}
        <div className="flex justify-center items-center space-x-6 mb-6">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 flex items-center justify-center rounded-lg border border-accent-color/30 bg-accent-color/10 hover:bg-accent-color/20 text-text-secondary hover:text-accent-color transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-color/20"
              aria-label="GitHub"
            >
              <i className="fab fa-github text-2xl group-hover:rotate-12 transition-transform duration-300"></i>
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 flex items-center justify-center rounded-lg border border-accent-color/30 bg-accent-color/10 hover:bg-accent-color/20 text-text-secondary hover:text-accent-color transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-color/20"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin text-2xl group-hover:rotate-12 transition-transform duration-300"></i>
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 flex items-center justify-center rounded-lg border border-accent-color/30 bg-accent-color/10 hover:bg-accent-color/20 text-text-secondary hover:text-accent-color transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-color/20"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-2xl group-hover:rotate-12 transition-transform duration-300"></i>
            </a>
          )}
          {socialLinks.telegram && (
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 flex items-center justify-center rounded-lg border border-accent-color/30 bg-accent-color/10 hover:bg-accent-color/20 text-text-secondary hover:text-accent-color transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-color/20"
              aria-label="Telegram"
            >
              <i className="fab fa-telegram-plane text-2xl group-hover:rotate-12 transition-transform duration-300"></i>
            </a>
          )}
          {socialLinks.whatsapp && (
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-12 h-12 flex items-center justify-center rounded-lg border border-accent-color/30 bg-accent-color/10 hover:bg-accent-color/20 text-text-secondary hover:text-accent-color transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-color/20"
              aria-label="WhatsApp"
            >
              <i className="fab fa-whatsapp text-2xl group-hover:rotate-12 transition-transform duration-300"></i>
            </a>
          )}
          {socialLinks.email && (
            <a
              href={`mailto:${socialLinks.email}`}
              className="group relative w-12 h-12 flex items-center justify-center rounded-lg border border-accent-color/30 bg-accent-color/10 hover:bg-accent-color/20 text-text-secondary hover:text-accent-color transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-color/20"
              aria-label="Email"
            >
              <i className="fas fa-envelope text-2xl group-hover:rotate-12 transition-transform duration-300"></i>
            </a>
          )}
        </div>

        {/* Copyright - Enhanced */}
        <div className="text-center">
          <p className="text-sm text-gray-400 font-mono">
            &copy; {currentYear} {aboutData?.name || 'MrAashish0x1'}. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2 font-mono flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Connection established. System integrity:{' '}
            <span className="text-accent-color font-bold">100%</span>. Standby for next command...
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

