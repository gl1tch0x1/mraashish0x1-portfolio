import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', data);
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.data));
        
        toast.success('Login successful! Redirecting to dashboard...');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/sec/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-bg via-secondary-bg to-primary-bg py-12 px-4 sm:px-6 lg:px-8">
      {/* Matrix Rain Background Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-rain-bg"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-accent-color/10 rounded-lg flex items-center justify-center border-2 border-accent-color/30 backdrop-blur-sm">
                <i className="fas fa-shield-alt text-4xl text-accent-color"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-color rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-accent-color mb-2 font-mono">
            SECURE ACCESS
          </h2>
          <p className="text-text-secondary text-sm font-mono">
            <span className="text-accent-color">&gt;</span> Admin Portal Authentication
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-text-secondary">
            <i className="fas fa-lock text-accent-color"></i>
            <span>256-bit Encrypted Connection</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-secondary-bg/50 backdrop-blur-md rounded-lg border border-accent-color/20 shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2 font-mono">
                <i className="fas fa-envelope text-accent-color mr-2"></i>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-accent-color/30'
                } bg-primary-bg/50 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all duration-300 font-mono`}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 font-mono">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2 font-mono">
                <i className="fas fa-key text-accent-color mr-2"></i>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-accent-color/30'
                } bg-primary-bg/50 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-color focus:border-transparent transition-all duration-300 font-mono`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 font-mono">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-primary-bg bg-accent-color hover:bg-accent-color/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-color transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-mono shadow-lg shadow-accent-color/30 hover:shadow-accent-color/50"
                style={{ color: '#0a0f18' }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    <span style={{ color: '#0a0f18' }}>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    <span style={{ color: '#0a0f18' }}>ACCESS SYSTEM</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-accent-color/20">
            <div className="flex items-start space-x-2 text-xs text-text-secondary">
              <i className="fas fa-info-circle text-accent-color mt-0.5"></i>
              <p className="font-mono">
                This is a restricted area. All access attempts are logged and monitored. 
                Unauthorized access is strictly prohibited.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-text-secondary hover:text-accent-color transition-colors duration-300 font-mono"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Return to Main Site
          </button>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-color/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-color/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default AdminLogin;

