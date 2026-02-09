import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/context/AppearanceContext';
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Settings,
  Hotel,
  ChevronLeft,
  Menu,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isSidebarCompact: collapsed, toggleSidebarCompact: setCollapsed } = useAppearance();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
    { href: '/admin/rooms', icon: Bed, label: 'Chambres' },
    { href: '/admin/reservations', icon: Calendar, label: 'Réservations' },
    { href: '/admin/contacts', icon: Mail, label: 'Messages' },
    { href: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex  p-1 rounded-lg">
              <img src="/logo.png" alt="Logo" className="h-20 w-auto" />
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={setCollapsed}
          >
            <ChevronLeft className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Back to site */}
        <div className="border-t border-sidebar-border p-4">
          <Link to="/">
            <Button
              variant="outline"
              className={cn(
                'w-full border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent',
                collapsed && 'px-0'
              )}
            >
              {collapsed ? (
                <Hotel className="h-5 w-5" />
              ) : (
                'Retour au site'
              )}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={cn('flex-1 transition-all', collapsed ? 'md:pl-20' : 'md:pl-64')}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold">Administration</h2>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
