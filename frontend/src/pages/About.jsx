import { useQuery } from '@tanstack/react-query';
import { aboutAPI, timelineAPI } from '../services/api';

// Import profile image - user needs to place their image at frontend/src/assets/images/profile.jpg
let profileImage;
try {
  profileImage = new URL('../assets/images/profile.jpg', import.meta.url).href;
} catch (e) {
  profileImage = null;
}

const About = () => {
  const { data: aboutData, isLoading: aboutLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const response = await aboutAPI.get();
      return response.data.data;
    },
  });

  const { data: timelineData, isLoading: timelineLoading } = useQuery({
    queryKey: ['timeline'],
    queryFn: async () => {
      const response = await timelineAPI.getAll();
      return response.data.data;
    },
  });

  if (aboutLoading || timelineLoading) {
    return (
      <section className="content-section">
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <div className="relative">
            <i className="fas fa-spinner fa-spin text-5xl text-accent-color"></i>
            <span className="absolute inset-0">
              <i className="fas fa-spinner text-5xl text-accent-color opacity-75"></i>
            </span>
          </div>
          <div className="text-accent-color text-2xl" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>Loading profile...</div>
          <div className="flex gap-2">
            <span className="w-2 h-2 bg-accent-color rounded-full"></span>
            <span className="w-2 h-2 bg-accent-color rounded-full"></span>
            <span className="w-2 h-2 bg-accent-color rounded-full"></span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="content-section">
      <h2 className="section-title" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
        <span className="inline-block w-2 h-2 bg-accent-color rounded-full mr-2"></span>
        About_Me.init()
      </h2>

      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* Profile Image - Enhanced */}
        <div className="md:col-span-2 text-center">
          <div className="rounded-xl border border-accent-color/30 p-6 shadow-lg">
            <div className="relative inline-block">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="MrAashish0x1 Profile"
                  className="rounded-xl w-full max-w-[320px] h-auto mx-auto mb-4 border-4 border-accent-color/30 shadow-xl object-cover"
                  style={{ aspectRatio: '1/1' }}
                />
              ) : (
                <div className="rounded-xl w-full max-w-[320px] h-[320px] mx-auto mb-4 border-4 border-accent-color/30 shadow-xl bg-gradient-to-br from-secondary-bg to-primary-bg flex items-center justify-center">
                  <div className="text-center">
                    <i className="fas fa-user text-6xl text-accent-color/30 mb-4"></i>
                    <p className="text-accent-color/50 text-sm" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                      Place profile.jpg in<br/>frontend/src/assets/images/
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-primary-bg"></div>
            </div>
            <h3 className="text-3xl title-font text-accent-color mt-4" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              {aboutData?.name || 'MrAashish0x1'}
            </h3>
            <p className="text-text-secondary text-lg mt-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              {aboutData?.title || 'Cybersecurity Specialist | Threat Hunter'}
            </p>
            <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              <i className="fas fa-shield-alt text-accent-color"></i>
              {aboutData?.subtitle || 'Ethical Hacker | Security Researcher'}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="md:col-span-3">
          {aboutData?.bio?.map((paragraph, index) => (
            <p key={index} className="mb-4 text-lg leading-relaxed" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              {paragraph}
            </p>
          )) || (
              <>
                <p className="mb-4 text-lg leading-relaxed" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  Greetings! I'm Aashish Pandey Aka MrAashish0x1, a dynamic and results-oriented professional with a robust{' '}
                  <strong>above 7 year background in the Cyber Security, Threat Hunting and Penetration Testing domain</strong>. My journey began with mastering the
                  intricacies of Cyber Security and has since expanded into the realms of{' '}
                  <strong>Threat Hunting and Threat Mitigation</strong>, where I strive to create intuitive and impactful
                  Security Infrastructure.
                </p>
                <p className="mb-4 text-lg leading-relaxed" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  For the past three years, my focus has sharpened on <strong>WordPress programming</strong>. This
                  involves crafting bespoke themes and plugins from the ground up, often with a special emphasis on{' '}
                  <strong>Farsi-language concepts</strong>. I'm driven by the belief that the Farsi digital space holds
                  immense untapped potential for innovation.
                </p>
                <p className="mb-4 text-lg leading-relaxed" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                  My development philosophy is rooted in continuous learning and adaptation. I've enthusiastically
                  embraced an <strong>AI-enhanced development workflow</strong>, integrating AI tools to optimize the
                  development lifecycle.
                </p>
              </>
            )}
          {aboutData?.philosophy && (
            <p className="text-lg leading-relaxed hacker-terminal" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              // My Philosophy:{' '}
              <span className="text-text-primary">"{aboutData.philosophy}"</span>
            </p>
          )}
        </div>
      </div>

      {/* Timeline - Enhanced */}
      {timelineData && timelineData.length > 0 && (
        <div className="mt-16 pt-10 border-t border-accent-color/20">
          <h3 className="text-2xl md:text-3xl title-font text-accent-color mb-10 text-center" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
            <span className="inline-block w-2 h-2 bg-accent-color rounded-full mr-2"></span>
            // Timeline_Highlights
          </h3>
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line - Enhanced */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-accent-color via-accent-color/50 to-transparent"></div>

            {/* Timeline items - Enhanced */}
            <div className="space-y-12">
              {timelineData.map((item, index) => (
                <div
                  key={item._id}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Content - Enhanced */}
                  <div className="w-full md:w-5/12">
                    <div className="p-6 rounded-xl border border-accent-color/30 shadow-lg">
                      <span className="title-font text-accent-color text-xl block mb-2 flex items-center gap-2" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
                        <i className="fas fa-calendar-alt text-sm"></i>
                        {item.date}
                      </span>
                      <h4 className="font-bold text-lg mb-2 text-text-primary" style={{ color: '#cdd6f4', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{item.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#a6adc8', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{item.description}</p>
                    </div>
                  </div>

                  {/* Center dot - Enhanced */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-accent-color to-green-400 rounded-full border-4 border-primary-bg shadow-lg shadow-accent-color/50 z-10 items-center justify-center">
                    <i className={`${item.icon} text-primary-bg text-sm`}></i>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;

