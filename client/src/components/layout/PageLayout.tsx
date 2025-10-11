import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import { theme } from '@/lib/theme';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function PageLayout({ 
  children, 
  title = 'AfterHours HVAC', 
  description = 'Professional HVAC services in Calgary and surrounding areas. 24/7 emergency repairs, installations, and maintenance.',
  className = ''
}: PageLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className={`flex-1 ${className}`}>
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
}

export function Section({ 
  children, 
  className = '', 
  containerClassName = '',
  size = 'md' 
}: { 
  children: ReactNode; 
  className?: string;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  return (
    <section className={`${theme.spacing.section[size]} ${className}`}>
      <div className={`${theme.spacing.container} ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
