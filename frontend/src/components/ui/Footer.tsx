// src/components/ui/Footer.tsx
import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();

  const navLinks = [
    { name: t('navbar.home'), href: '/' },
    { name: t('navbar.products'), href: '/productos' },
    { name: t('navbar.events'), href: '/eventos' },
    { name: t('navbar.about'), href: '/nosotros' },
    { name: t('navbar.contact'), href: '/contacto' }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ];

  return (
    <footer className="bg-neutral-900 text-white relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-black text-amber-400">
              BAKEHAUS
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-amber-500 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <IconComponent size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold text-white">{t('footer.quickLinks')}</h4>
            <div className="space-y-3">
              {navLinks.map((link) => (
                <motion.div key={link.name} whileHover={{ x: 5 }}>
                  <Link
                    to={link.href}
                    className="block text-neutral-300 hover:text-amber-400 transition-colors duration-300 text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold text-white">{t('footer.contact')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-neutral-300 text-sm">
                  <div className="font-medium">
                    {i18n.language === 'es' ? 'Zona 10, Ciudad de Guatemala' : 'Zone 10, Guatemala City'}
                  </div>
                  <div>Guatemala, GT</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-amber-400 flex-shrink-0" />
                <span className="text-neutral-300 text-sm font-medium">+502 2345-6789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-amber-400 flex-shrink-0" />
                <span className="text-neutral-300 text-sm font-medium">
                  {i18n.language === 'es' ? 'hola@bakehaus.gt' : 'hello@bakehaus.gt'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hours & Newsletter */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold text-white">{t('footer.hours')}</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-neutral-300 text-sm">
                  <div>{t('footer.schedule.weekdays')}</div>
                  <div>{t('footer.schedule.saturday')}</div>
                  <div>{t('footer.schedule.sunday')}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-white">{t('footer.newsletter')}</h5>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <motion.button
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('footer.subscribe')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-neutral-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-neutral-400 text-sm">
            © 2024 Bakehaus. {t('footer.allRights')}.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-400 hover:text-amber-400 transition-colors duration-300 text-sm">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-neutral-400 hover:text-amber-400 transition-colors duration-300 text-sm">
              {t('footer.terms')}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
    </footer>
  );
};