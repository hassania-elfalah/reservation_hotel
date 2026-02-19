import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Calendar } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex w-full h-20 items-center justify-between px-8">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <img src={settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage') ? settings.logo_url : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`} alt={settings.hotel_name} className="h-16 w-auto object-contain" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/rooms">
            <Button size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Réserver
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-semibold">
              <User className="mr-2 h-4 w-4" />
              Se connecter
            </Button>
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t bg-card md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Se connecter
                </Button>
              </Link>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>

              </Link>
              <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Réserver
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
