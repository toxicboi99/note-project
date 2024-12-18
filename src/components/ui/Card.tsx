import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function Card({ to, icon: Icon, title, description }: CardProps) {
  return (
    <Link to={to} className="relative group">
      <div className="rounded-lg bg-white shadow-lg p-6 hover:shadow-xl transition-shadow">
        <Icon className="h-8 w-8 text-indigo-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}