import React from 'react';
import { Card } from '../components/ui/Card';
import { Icons } from '../components/icons';

const features = [
  {
    path: '/notes',
    icon: Icons.FileText,
    title: 'Notes',
    description: 'Access and download helpful programming notes and PDFs.',
  },
  {
    path: '/unicode',
    icon: Icons.Code,
    title: 'Unicode',
    description: 'Browse and copy programming code snippets with syntax highlighting.',
  },
  {
    path: '/tools',
    icon: Icons.Tools,
    title: 'Tools',
    description: 'Use our collection of development tools and utilities.',
  },
  {
    path: '/contact',
    icon: Icons.Mail,
    title: 'Contact',
    description: 'Get in touch with us for support or feedback.',
  },
];

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to DevTools Hub
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your one-stop destination for development tools, resources, and utilities.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.path} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}