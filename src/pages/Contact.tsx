import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-500">
          Get in touch with our team for support or feedback
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="prose prose-indigo">
            <h2>Get in Touch</h2>
            <p>
              We'd love to hear from you. Please fill out the form below or use our
              contact information.
            </p>
          </div>
          <dl className="mt-8 space-y-6">
            <dt className="sr-only">Email</dt>
            <dd className="flex items-center">
              <Mail className="h-6 w-6 text-indigo-600" />
              <span className="ml-3 text-gray-500">support@example.com</span>
            </dd>
            <dt className="sr-only">Phone</dt>
            <dd className="flex items-center">
              <Phone className="h-6 w-6 text-indigo-600" />
              <span className="ml-3 text-gray-500">+1 (555) 123-4567</span>
            </dd>
            <dt className="sr-only">Address</dt>
            <dd className="flex items-center">
              <MapPin className="h-6 w-6 text-indigo-600" />
              <span className="ml-3 text-gray-500">
                123 Developer Street, Code City, 12345
              </span>
            </dd>
          </dl>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}