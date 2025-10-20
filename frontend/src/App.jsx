import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/common/ScrollProgress';
import Loader from './components/common/Loader';
import MouseGlow from './components/effects/MouseGlow';
import CustomContextMenu from './components/common/CustomContextMenu';
import ScanlineOverlay from './components/effects/ScanlineOverlay';
import PageTransition from './components/common/PageTransition';
import MatrixRain from './components/effects/MatrixRain';

// Lazy load pages for better code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/sec/admin');

  useEffect(() => {
    // Show loader on route change (except for admin routes)
    if (!isAdminRoute) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAdminRoute]);

  // Admin routes layout
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-primary-bg text-text-primary relative">
        {/* Global Matrix Rain Background */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <MatrixRain />
        </div>

        <div className="relative z-10">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/sec/admin" element={<AdminLogin />} />
              <Route path="/sec/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    );
  }

  // Public routes layout
  return (
    <div className="min-h-screen bg-primary-bg text-text-primary relative">
      {/* Global Matrix Rain Background - Fixed position covering entire viewport */}
      <div className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none">
        <MatrixRain />
      </div>

      {/* Interactive Effects */}
      <ScanlineOverlay />
      <MouseGlow />
      <CustomContextMenu />

      {/* Loader */}
      {loading && <Loader />}

      {/* Header */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Main Content with Page Transitions */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <PageTransition>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Scroll Progress */}
      <ScrollProgress />
    </div>
  );
}

export default App;

