import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { motion } from 'framer-motion';

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
    <footer className="border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#020817] text-slate-800 dark:text-gray-200 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div className="space-y-4">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={settings.logo_url.startsWith('/') && !settings.logo_url.startsWith('/storage') ? settings.logo_url : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace('/api', '')}${settings.logo_url}`}
              alt={settings.hotel_name}
              className="h-24 w-auto object-contain bg-white/5 p-2 rounded-xl"
            />
            <p className="text-sm opacity-70 leading-relaxed max-w-xs">Découvrez l'excellence de l'hospitalité marocaine à travers un séjour inoubliable dans notre établissement.</p>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-4 relative inline-block">
              Liens
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                className="absolute -bottom-1 left-0 h-0.5 bg-[#D4A017] rounded-full"
              ></motion.span>
            </h4>
            <ul className="space-y-1.5 text-sm opacity-70">
              {sections.links.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={l.href} className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-4 relative inline-block">
              Contact
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                className="absolute -bottom-1 left-0 h-0.5 bg-[#D4A017] rounded-full"
              ></motion.span>
            </h4>
            <ul className="space-y-1.5 text-sm opacity-70">
              {sections.contact.map((c, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-start gap-3"
                >
                  <c.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="leading-snug">{c.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xl mb-4 relative inline-block">
              Suivez-nous
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                className="absolute -bottom-1 left-0 h-0.5 bg-[#D4A017] rounded-full"
              ></motion.span>
            </h4>
            {socialNetworks.length > 0 ? (
              <div className="flex flex-wrap gap-4 pt-1">
                {socialNetworks.filter(s => s.url).map((social, i) => {
                  const IconComponent = getSocialIcon(social.name);
                  return (
                    <motion.a
                      key={social.id}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className="p-3.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-[#D4A017] hover:border-[#D4A017] hover:text-white transition-all duration-300"
                    >
                      <IconComponent size={20} />
                    </motion.a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs opacity-50 pt-2">Aucun réseau social configuré</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-6 border-t border-white/10"
        >
          <div className="flex justify-center">
            <p className="text-xs opacity-50 text-center">
              © {new Date().getFullYear()} {settings.hotel_name}. PFE - Système de Réservation. Tous droits réservés.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
