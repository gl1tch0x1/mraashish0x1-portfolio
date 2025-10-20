import { useEffect } from 'react';

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[10000] animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-secondary-bg p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-border animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
          <h3 className="text-2xl md:text-3xl title-font text-accent">{project.title}</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-accent text-3xl transition-colors duration-200"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-2 flex-grow">
          {/* Image */}
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto max-h-80 object-contain rounded-lg mb-6 shadow-lg border-2 border-border"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* Full Description */}
          <h4 className="text-xl title-font text-accent mb-2">Description:</h4>
          <div className="text-text-secondary mb-6 leading-relaxed text-base whitespace-pre-line">
            {project.fullDescription}
          </div>

          {/* Technologies */}
          <h4 className="text-xl title-font text-accent mb-2">Technologies Used:</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies?.map((tech, index) => (
              <span
                key={index}
                className="inline-block bg-primary-bg border border-border text-accent text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        {project.link && project.link !== '#' && (
          <div className="mt-auto pt-4 border-t border-border text-right">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-2 inline-block"
            >
              Visit Project <i className="fas fa-external-link-alt ml-2"></i>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;

