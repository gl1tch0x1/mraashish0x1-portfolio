import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '../services/api';
import ProjectModal from '../components/projects/ProjectModal';
import AnimatedCard from '../components/common/AnimatedCard';

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const projectsPerPage = 6;

  const { data: projectsResponse, isLoading } = useQuery({
    queryKey: ['projects', { page: currentPage, limit: projectsPerPage, status: 'active' }],
    queryFn: async () => {
      const response = await projectsAPI.getAll({
        page: currentPage,
        limit: projectsPerPage,
        status: 'active',
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <section className="content-section">
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <div className="relative">
            <i className="fas fa-spinner fa-spin text-5xl text-accent-color"></i>
            <span className="absolute inset-0 animate-ping">
              <i className="fas fa-spinner text-5xl text-accent-color opacity-75"></i>
            </span>
          </div>
          <div className="text-accent-color text-2xl font-mono">Loading projects...</div>
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </section>
    );
  }

  const projects = projectsResponse?.data || [];
  const totalPages = projectsResponse?.pages || 1;

  return (
    <section className="content-section">
      <h2 className="section-title font-mono">
        <span className="inline-block w-2 h-2 bg-accent-color rounded-full animate-pulse mr-2"></span>
        Project_Showcase.exe
      </h2>
      <p className="text-center text-lg mb-12 text-text-secondary max-w-2xl mx-auto backdrop-blur-sm bg-secondary-bg/30 p-4 rounded-xl border border-accent-color/20">
        <i className="fas fa-shield-alt text-accent-color mr-2"></i>
        Security-focused projects demonstrating expertise in penetration testing, vulnerability assessment, and defensive security measures.
      </p>

      {/* Projects Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
        {projects.map((project) => (
          <AnimatedCard
            key={project._id}
            className="rounded-xl overflow-hidden shadow-xl transition-all duration-300 border border-accent-color/30 bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md flex flex-col hover:border-accent-color/50 hover:shadow-accent-color/20"
          >
            <div className="relative overflow-hidden group">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-secondary-bg to-primary-bg flex items-center justify-center">
                  <i className="fas fa-project-diagram text-5xl text-accent-color/30"></i>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl lg:text-2xl font-semibold mb-3 title-font text-accent-color font-mono flex items-center gap-2">
                  <i className="fas fa-terminal text-sm"></i>
                  {project.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">{project.description}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-block bg-accent-color/10 border border-accent-color/30 text-accent-color text-xs font-semibold px-3 py-1 rounded-full shadow-sm hover:bg-accent-color/20 transition-colors duration-200 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(project)}
                className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-accent-color border border-accent-color/30 rounded-lg overflow-hidden hover:text-primary-bg transition-all duration-300 hover:border-accent-color hover:shadow-lg hover:shadow-accent-color/20 mt-auto self-start"
              >
                <span className="absolute inset-0 bg-accent-color transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="relative z-10 flex items-center gap-2">
                  View Details
                  <i className="fas fa-info-circle group-hover:rotate-12 transition-transform duration-300"></i>
                </span>
              </button>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`btn btn-outline ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <i className="fas fa-angle-left mr-2"></i> Previous
          </button>
          <span className="hacker-terminal text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`btn btn-outline ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next <i className="fas fa-angle-right ml-2"></i>
          </button>
        </div>
      )}

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default Projects;

