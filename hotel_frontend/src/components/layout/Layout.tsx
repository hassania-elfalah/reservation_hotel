import { ReactNode } from 'react';
import Footer from './Footer';
import ClientSidebar from './ClientSidebar';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="fixed top-6 left-6 z-[100]">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 flex-col pt-20 md:pt-0 md:mr-24">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <ClientSidebar />
    </div>
  );
};

export default Layout;
