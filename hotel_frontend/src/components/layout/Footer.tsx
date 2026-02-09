import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';

interface SocialNetwork {
  id: string;
  name: string;
  url: string;
}

const Footer = () => {
  const { settings } = useSettings();

  // Parse social networks from settings
  let socialNetworks: SocialNetwork[] = [];
  try {
    if (settings.social_networks) {
      socialNetworks = JSON.parse(settings.social_networks);
    }
  } catch (e) {
    console.error('Error parsing social networks:', e);
  }

  // Get icon based on network name
  const getSocialIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('facebook')) return Facebook;
    if (lowerName.includes('instagram')) return Instagram;
    if (lowerName.includes('twitter') || lowerName.includes('x')) return Twitter;
    if (lowerName.includes('linkedin')) return Linkedin;
    if (lowerName.includes('youtube')) return Youtube;
    return Share2; // Default icon
  };

  const sections = {
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Chambres', href: '/rooms' },
      { label: 'Réservations', href: '/reservations' },
      { label: 'S\'inscrire', href: '/register' }
    ],
    contact: [
      { icon: MapPin, text: settings.hotel_address },
      { icon: Phone, text: settings.hotel_phone },
      { icon: Mail, text: settings.hotel_email }
    ]
  };

  return (
    <footer className="border-t border-white/10 bg-[#0A1629] dark:bg-[#020817] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-4">
            <img src="/logo.png" alt="Logo" className="h-24 w-auto object-contain bg-white/5 p-2 rounded-xl" />
            <p className="text-sm opacity-70 leading-relaxed max-w-xs">Découvrez l'excellence de l'hospitalité marocaine à travers un séjour inoubliable dans notre établissement.</p>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-6 relative inline-block">
              Liens
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#D4A017] rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm opacity-70">
              {sections.links.map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-6 relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#D4A017] rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm opacity-70">
              {sections.contact.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <c.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="leading-snug">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-6 relative inline-block">
              Suivez-nous
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#D4A017] rounded-full"></span>
            </h4>
            {socialNetworks.length > 0 ? (
              <div className="flex flex-wrap gap-4 pt-2">
                {socialNetworks.filter(s => s.url).map((social) => {
                  const IconComponent = getSocialIcon(social.name);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className="p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#D4A017] hover:border-[#D4A017] hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95"
                    >
                      <IconComponent size={20} className="transition-transform group-hover:rotate-[360deg] duration-500" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs opacity-50 pt-2">Aucun réseau social configuré</p>
            )}
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10">
          <div className="flex justify-center">
            <p className="text-xs opacity-50 text-center">
              © {new Date().getFullYear()} {settings.hotel_name}. PFE - Système de Réservation. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
