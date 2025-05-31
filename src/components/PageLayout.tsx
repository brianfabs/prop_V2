import React from 'react';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, description, children, className = '' }) => (
  <main className={`min-h-screen bg-muted ${className}`}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <section>
        <h1 className="text-3xl font-medium text-primary-dark mb-1">{title}</h1>
        {description && <p className="text-base text-muted">{description}</p>}
      </section>
      {children}
    </div>
  </main>
); 