import { useQuery } from '@tanstack/react-query';
import { servicesAPI } from '../services/api';
import AnimatedCard from '../components/common/AnimatedCard';

const Services = () => {
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await servicesAPI.getAll({ active: true });
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
          <div className="text-accent-color text-2xl font-mono">Loading services...</div>
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
    <section className="content-section px-4">
      <h2 className="section-title font-mono text-2xl sm:text-3xl md:text-4xl">
        <span className="inline-block w-2 h-2 bg-accent-color rounded-full animate-pulse mr-2"></span>
        Services_Offered
      </h2>
      <p className="text-center text-sm sm:text-base md:text-lg mb-8 sm:mb-12 text-text-secondary max-w-2xl mx-auto backdrop-blur-sm bg-secondary-bg/30 p-3 sm:p-4 rounded-xl border border-accent-color/20">
        <i className="fas fa-shield-alt text-accent-color mr-2"></i>
        Comprehensive cybersecurity services from vulnerability assessment to red team operations, tailored to strengthen your security posture.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {servicesData?.map((service, index) => (
          <AnimatedCard
            key={service._id}
            className="bg-gradient-to-br from-secondary-bg/80 to-secondary-bg/50 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-accent-color/30 shadow-lg transition-all duration-300 hover:border-accent-color/50 hover:shadow-accent-color/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-gradient-to-br from-accent-color/20 to-accent-color/5 rounded-xl flex items-center justify-center border border-accent-color/30 shadow-lg">
              <i className={`${service.icon} text-2xl sm:text-3xl text-accent-color`}></i>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl title-font text-accent-color mb-2 sm:mb-3 font-mono">{service.title}</h3>
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{service.description}</p>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-accent-color/20">
              <span className="text-xs text-accent-color font-mono flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Active Service
              </span>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
};

export default Services;

