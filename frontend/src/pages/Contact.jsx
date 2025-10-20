import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => contactAPI.submit(data),
    onSuccess: () => {
      toast.success('Message sent successfully! I\'ll get back to you soon.');
      reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <section className="content-section">
      <h2 className="section-title" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
        <span className="inline-block w-2 h-2 bg-accent-color rounded-full mr-2"></span>
        Initiate_Contact
      </h2>
      <p className="text-center text-lg mb-12 text-text-secondary max-w-xl mx-auto p-4 rounded-xl border border-accent-color/20" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
        <i className="fas fa-terminal text-accent-color mr-2"></i>
        Have a security project or collaboration opportunity? Send a secure transmission. Let's strengthen digital defenses together.
      </p>

      <div className="max-w-lg mx-auto p-6 sm:p-8 rounded-xl border border-accent-color/30 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium hacker-terminal" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              // FROM (Name):
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
              })}
              className={`bg-transparent border-b-2 ${
                errors.name ? 'border-red-500' : 'border-accent-color/30'
              } text-text-primary text-sm focus:border-accent-color focus:ring-0 block w-full p-2.5 placeholder-text-secondary/60 outline-none`}
              style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
              placeholder="Your Identifier"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium hacker-terminal" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              // RETURN_PATH (Email):
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`bg-transparent border-b-2 ${
                errors.email ? 'border-red-500' : 'border-accent-color/30'
              } text-text-primary text-sm focus:border-accent-color focus:ring-0 block w-full p-2.5 placeholder-text-secondary/60 outline-none`}
              style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
              placeholder="your.signal@domain.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{errors.email.message}</p>}
          </div>

          {/* Subject Field */}
          <div className="mb-6">
            <label htmlFor="subject" className="block mb-2 text-sm font-medium hacker-terminal" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              // SUBJECT_LINE:
            </label>
            <input
              type="text"
              id="subject"
              {...register('subject', {
                required: 'Subject is required',
                minLength: { value: 3, message: 'Subject must be at least 3 characters' },
                maxLength: { value: 200, message: 'Subject cannot exceed 200 characters' },
              })}
              className={`bg-transparent border-b-2 ${
                errors.subject ? 'border-red-500' : 'border-accent-color/30'
              } text-text-primary text-sm focus:border-accent-color focus:ring-0 block w-full p-2.5 placeholder-text-secondary/60 outline-none`}
              style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
              placeholder="Transmission Subject"
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{errors.subject.message}</p>}
          </div>

          {/* Message Field */}
          <div className="mb-8">
            <label htmlFor="message" className="block mb-2 text-sm font-medium hacker-terminal" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>
              // MESSAGE_PAYLOAD:
            </label>
            <textarea
              id="message"
              rows="5"
              {...register('message', {
                required: 'Message is required',
                minLength: { value: 10, message: 'Message must be at least 10 characters' },
                maxLength: { value: 2000, message: 'Message cannot exceed 2000 characters' },
              })}
              className={`bg-transparent border-2 ${
                errors.message ? 'border-red-500' : 'border-accent-color/30'
              } text-text-primary text-sm rounded-md focus:border-accent-color focus:ring-0 block w-full p-2.5 placeholder-text-secondary/60 outline-none resize-none`}
              style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
              placeholder="Your encrypted message..."
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}>{errors.message.message}</p>}
          </div>

          {/* Submit Button - Fixed Visibility */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 text-base font-bold bg-accent-color rounded-lg shadow-lg ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-400'
            }`}
            style={{ color: '#ffffff', fontFamily: 'Ubuntu Mono, monospace', fontWeight: 700 }}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Transmitting...
              </>
            ) : (
              <>
                Transmit Message <i className="fas fa-paper-plane"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;

