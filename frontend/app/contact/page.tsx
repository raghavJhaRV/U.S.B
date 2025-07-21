"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://usb-backend.onrender.com'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold uppercase">Contact Us</h1>
        <p className="mt-2 text-sm text-gray-300 max-w-md mx-auto">
          Have questions or need more information? Fill out the form below and we will get back to you shortly.
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://www.instagram.com/united.storm.basketball"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-gray-400 transition"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://www.facebook.com/unitedstormbasketball"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-gray-400 transition"
            aria-label="Facebook"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-600 text-white p-4 rounded text-center">
            Thank you for your message! We will get back to you soon.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="bg-red-600 text-white p-4 rounded text-center">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="bg-black border border-white px-4 py-2 w-full outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="bg-black border border-white px-4 py-2 w-full outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="tel"
            name="phone"
            placeholder="Phone (Optional)"
            value={formData.phone}
            onChange={handleInputChange}
            className="bg-black border border-white px-4 py-2 w-full outline-none"
          />
        </div>
        <textarea
          name="message"
          placeholder="Message"
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          required
          className="bg-black border border-white px-4 py-2 w-full outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-white px-6 py-2 font-semibold uppercase hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Footer */}
      <footer className="text-center mt-16 text-xs text-gray-400">
        ©2024 United S.T.O.R.M. Basketball
      </footer>
    </div>
  );
}

