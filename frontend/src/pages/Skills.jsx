import { useQuery } from '@tanstack/react-query';
import { skillsAPI } from '../services/api';

const Skills = () => {
  const { data: skillsData, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await skillsAPI.getAll();
      return response.data.data;
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
          <div className="text-accent-color text-2xl font-mono">Loading skills...</div>
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-accent-color rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="content-section">
      <h2 className="section-title font-mono">
        <span className="inline-block w-2 h-2 bg-accent-color rounded-full animate-pulse mr-2"></span>
        Tech_Stack & Abilities
      </h2>
      <p className="text-center text-lg mb-12 text-text-secondary max-w-2xl mx-auto backdrop-blur-sm bg-secondary-bg/30 p-4 rounded-xl border border-accent-color/20">
        <i className="fas fa-code text-accent-color mr-2"></i>
        Comprehensive cybersecurity toolkit including penetration testing frameworks, security analysis tools, and programming languages for exploit development.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
        {skillsData?.map((skill) => (
          <div
            key={skill._id}
            className="skill-item p-6 rounded-lg shadow-md transition-all duration-300 flex flex-col justify-between interactive-glow-box tilt-effect"
          >
            <div>
              <div className="flex items-center mb-4">
                <i className={`${skill.icon} ${skill.color} text-4xl mr-4`}></i>
                <h3 className="text-xl font-semibold hacker-terminal">{skill.name}</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary-color)] mb-3">Level: {skill.level}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[var(--primary-bg)] rounded-full h-3.5 mt-auto border border-[var(--border-color)] overflow-hidden">
              <div
                className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${skill.proficiency}%`,
                  boxShadow: '0 0 8px var(--accent-color), inset 0 0 3px rgba(0,0,0,0.3)',
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

