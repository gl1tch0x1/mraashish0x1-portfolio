import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { aboutAPI, skillsAPI, cvAPI, approachAPI } from "../services/api";
import TypeWriter from "../components/effects/TypeWriter";
import toast from "react-hot-toast";

const Home = () => {
  const { data: aboutData } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const response = await aboutAPI.get();
      return response.data.data;
    },
  });

  const { data: skillsData } = useQuery({
    queryKey: ["skills", { featured: true }],
    queryFn: async () => {
      const response = await skillsAPI.getAll({ featured: true });
      return response.data.data;
    },
  });

  // Fetch approach items
  const { data: approachData } = useQuery({
    queryKey: ["approach", { featured: true }],
    queryFn: async () => {
      const response = await approachAPI.getAll({ featured: true });
      return response.data.data;
    },
  });

  // Fetch CV info
  const { data: cvInfo } = useQuery({
    queryKey: ["cv"],
    queryFn: async () => {
      try {
        const response = await cvAPI.getCurrent();
        return response.data.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle CV view (open Google Drive link)
  const handleCVView = async () => {
    if (!cvInfo) {
      toast.error(
        "CV is not available at the moment. Please check back later."
      );
      return;
    }

    try {
      // Open Google Drive link in new tab
      window.open(cvInfo.googleDriveLink, "_blank", "noopener,noreferrer");
      toast.success("Opening CV in new tab...");
    } catch (error) {
      console.error("Error opening CV:", error);
      toast.error("Failed to open CV. Please try again.");
    }
  };

  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    linesOfCode: 0,
  });

  useEffect(() => {
    if (!aboutData) return;

    const animateCounter = (key, target, duration = 1500) => {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }));
      }, 16);

      return () => clearInterval(timer);
    };

    const timers = [
      animateCounter("experience", aboutData.yearsExperience || 7),
      animateCounter("projects", aboutData.projectsCompleted || 50),
      animateCounter("linesOfCode", aboutData.linesOfCode || 1000),
    ];

    return () => timers.forEach((cleanup) => cleanup && cleanup());
  }, [aboutData]);

  const featuredSkills = skillsData?.slice(0, 5) || [];

  const approach = approachData || [];

  return (
    <section
      id="home-section"
      className="content-section text-center flex flex-col justify-center items-center relative overflow-hidden"
    >
      <div className="w-full max-w-4xl z-10 relative py-4 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
        <h1 className="font-bold mb-3 sm:mb-4 md:mb-6">
          <span className="hero-title-hacker block">
            <TypeWriter
              text="root@mraashish0x1:~ whoami"
              typingSpeed={50}
              showCursor={false}
            />
          </span>
          <span className="hero-title-main block mt-2">
            {aboutData?.tagline || "MrAashish0x1"}
          </span>
        </h1>
        <p className="hero-subtitle text-[var(--text-secondary-color)] mb-4 sm:mb-6 md:mb-8 px-2">
          {aboutData?.title ||
            "Cybersecurity Specialist | Threat Hunter | Penetration Testing"}
        </p>
        <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-6 sm:mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto px-2">
          {aboutData?.bio?.[0] ||
            "I thrive at the intersection of security and innovation—uncovering hidden threats, fortifying defenses, and building smarter digital ecosystems. With expertise in penetration testing and threat hunting, I turn vulnerabilities into opportunities for resilience. Passionate about cybersecurity and the transformative role of AI, I craft solutions that are not only robust but also future-proof."}
        </p>

        {/* CTA Buttons - Enhanced with CV Download & Mobile Responsive */}
        <div className="mb-6 sm:mb-10 md:mb-16 flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-4">
          <Link
            to="/projects"
            className="btn btn-primary text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 min-h-[44px] w-full sm:w-auto"
          >
            Explore My Work <i className="fas fa-folder-open ml-2"></i>
          </Link>
          <Link
            to="/contact"
            className="btn btn-outline text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 min-h-[44px] w-full sm:w-auto"
          >
            Get In Touch <i className="fas fa-terminal ml-2"></i>
          </Link>
          {/* View CV Button - Always visible, opens Google Drive link */}
          <button
            onClick={handleCVView}
            disabled={!cvInfo}
            className="group relative inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 min-h-[44px] bg-gradient-to-r from-[var(--accent-color)]/10 to-[var(--accent-color)]/5 border-2 border-[var(--accent-color)]/30 rounded-lg hover:border-[var(--accent-color)] hover:shadow-lg hover:shadow-[var(--accent-color)]/20 transition-all duration-300 overflow-hidden text-xs sm:text-sm md:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-[var(--accent-color)]/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <i className="fas fa-file-pdf text-[var(--accent-color)] mr-2 group-hover:animate-bounce relative z-10"></i>
            <span className="text-[var(--accent-color)] font-mono relative z-10">
              View CV
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-center max-w-3xl mx-auto mb-6 sm:mb-10 md:mb-16 px-2 sm:px-4">
          <div className="key-metric-box interactive-glow-box p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border-color)] bg-[var(--primary-bg)] transform hover:-translate-y-1 transition-transform duration-300 tilt-effect">
            <i className="fas fa-briefcase text-2xl sm:text-3xl md:text-4xl text-[var(--accent-color)] mb-2 animate-pulse-slow"></i>
            <p className="text-xl sm:text-2xl md:text-3xl title-font text-white">
              {counters.experience}
            </p>
            <p className="text-[var(--text-secondary-color)] text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-wider">
              Years Experience
            </p>
          </div>
          <div className="key-metric-box interactive-glow-box p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border-color)] bg-[var(--primary-bg)] transform hover:-translate-y-1 transition-transform duration-300 tilt-effect">
            <i
              className="fas fa-project-diagram text-2xl sm:text-3xl md:text-4xl text-[var(--accent-color)] mb-2 animate-pulse-slow"
              style={{ animationDelay: "0.2s" }}
            ></i>
            <p className="text-xl sm:text-2xl md:text-3xl title-font text-white">
              {counters.projects}
            </p>
            <p className="text-[var(--text-secondary-color)] text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-wider">
              Projects Completed
            </p>
          </div>
          <div className="key-metric-box interactive-glow-box p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border-color)] bg-[var(--primary-bg)] transform hover:-translate-y-1 transition-transform duration-300 tilt-effect">
            <i
              className="fas fa-code-branch text-2xl sm:text-3xl md:text-4xl text-[var(--accent-color)] mb-2 animate-pulse-slow"
              style={{ animationDelay: "0.4s" }}
            ></i>
            <p className="text-xl sm:text-2xl md:text-3xl title-font text-white">
              {counters.linesOfCode}
            </p>
            <p className="text-[var(--text-secondary-color)] text-[0.65rem] sm:text-xs md:text-sm uppercase tracking-wider">
              Lines of Code (K+)
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl z-10 relative mb-6 sm:mb-10 md:mb-16 px-2 sm:px-4">
          <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl title-font text-[var(--accent-color)] mb-4 sm:mb-6 md:mb-8 text-center">
            // My Approach_
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-left">
            {approach.map((step, index) => (
              <div
                key={index}
                className="approach-step-box interactive-glow-box p-3 sm:p-4 md:p-6 rounded-lg border border-[var(--border-color)] bg-[var(--primary-bg)] tilt-effect"
              >
                <i
                  className={`${step.icon} text-xl sm:text-2xl md:text-3xl text-[var(--accent-color)] mb-2`}
                ></i>
                <h4 className="text-sm sm:text-base md:text-lg lg:text-xl title-font text-white mb-2">
                  {step.title}
                </h4>
                <p className="text-[0.65rem] sm:text-xs md:text-sm text-[var(--text-secondary-color)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-4xl z-10 relative px-2 sm:px-4">
          <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl title-font text-[var(--accent-color)] mb-4 sm:mb-6 md:mb-8 text-center">
            // Featured Skills_
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 text-center">
            {featuredSkills.map((skill, index) => (
              <div
                key={index}
                className="featured-skill-box interactive-glow-box p-2 sm:p-3 md:p-4 rounded-lg border border-[var(--border-color)] bg-[var(--primary-bg)] transform hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center aspect-square tilt-effect"
              >
                <i
                  className={`${skill.icon} ${skill.color} text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 group-hover:animate-bounce`}
                ></i>
                <p className="text-[0.65rem] sm:text-xs md:text-sm font-semibold text-white leading-tight">{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
