// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      // Navbar
      'navbar.home': 'Inicio',
      'navbar.about': 'Nosotros',
      'navbar.products': 'Productos',
      'navbar.events': 'Eventos',
      'navbar.contact': 'Contacto',
      'navbar.cart': 'Carrito',
      'navbar.order': 'Ordenar',
      
      // Hero
      'hero.subtitle': 'PRODUCTOS ARTESANALES',
      'hero.badge': 'DESDE 1995',
      'hero.location': 'MÉXICO CITY • PREMIUM BAKERY • SINCE 1965',
      'hero.followUs': 'SÍGUENOS',
      'hero.access': 'ACCESO',
      
      // About
      'about.ourHistory': 'NUESTRA HISTORIA',
      'about.since': 'Desde',
      'about.historyText': 'En 1965, Bakehaus abrió en Nueva York con comida clásica americana y atmósfera vintage. En 2007, Steve y Tyra Abrams expandieron nuestra tradición familiar por todo el mundo.',
      'about.globalPresence': 'Presencia Global',
      'about.specialties': 'Especialidades',
      'about.cupcakes': 'Cupcakes',
      'about.cakes': 'Tortas',
      'about.cookies': 'Galletas',
      'about.eventsText': 'Especialistas en bodas, eventos corporativos, cumpleaños y baby showers',
      'about.requestQuote': 'Solicitar Cotización',
      'about.moreCities': '+3 ciudades más',
      
      // Footer
      'footer.quickLinks': 'Enlaces Rápidos',
      'footer.contact': 'Contacto',
      'footer.hours': 'Horarios',
      'footer.newsletter': 'Newsletter',
      'footer.emailPlaceholder': 'Tu email',
      'footer.subscribe': 'OK',
      'footer.allRights': 'Todos los derechos reservados',
      'footer.privacy': 'Política de Privacidad',
      'footer.terms': 'Términos de Servicio',
      'footer.description': 'Productos horneados artesanalmente con ingredientes premium desde 1995. Perfección en cada bocado.',
      'footer.schedule.weekdays': 'Lun - Vie: 6:00 - 20:00',
      'footer.schedule.saturday': 'Sáb: 6:00 - 22:00',
      'footer.schedule.sunday': 'Dom: 7:00 - 18:00',
      
      // Common
      'common.learnMore': 'Saber Más',
      'common.viewAll': 'Ver Todo',
      'common.addToCart': 'Agregar al Carrito',
      'common.buyNow': 'Comprar Ahora',
      'common.close': 'Cerrar',
      'common.loading': 'Cargando...'
    }
  },
  
  en: {
    translation: {
      // Navbar
      'navbar.home': 'Home',
      'navbar.about': 'About',
      'navbar.products': 'Products',
      'navbar.events': 'Events',
      'navbar.contact': 'Contact',
      'navbar.cart': 'Cart',
      'navbar.order': 'Order',
      
      // Hero
      'hero.subtitle': 'ARTISANAL PRODUCTS',
      'hero.badge': 'SINCE 1995',
      'hero.location': 'NEW YORK CITY • PREMIUM BAKERY • SINCE 1965',
      'hero.followUs': 'FOLLOW US',
      'hero.access': 'ACCESS',
      
      // About
      'about.ourHistory': 'OUR HISTORY',
      'about.since': 'Since',
      'about.historyText': 'In 1965, Bakehaus opened in New York with classic American food and vintage atmosphere. In 2007, Steve and Tyra Abrams expanded our family tradition worldwide.',
      'about.globalPresence': 'Global Presence',
      'about.specialties': 'Specialties',
      'about.cupcakes': 'Cupcakes',
      'about.cakes': 'Cakes',
      'about.cookies': 'Cookies',
      'about.eventsText': 'Specialists in weddings, corporate events, birthdays and baby showers',
      'about.requestQuote': 'Request Quote',
      'about.moreCities': '+3 more cities',
      
      // Footer
      'footer.quickLinks': 'Quick Links',
      'footer.contact': 'Contact',
      'footer.hours': 'Hours',
      'footer.newsletter': 'Newsletter',
      'footer.emailPlaceholder': 'Your email',
      'footer.subscribe': 'OK',
      'footer.allRights': 'All rights reserved',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.description': 'Artisanally baked products with premium ingredients since 1995. Perfection in every bite.',
      'footer.schedule.weekdays': 'Mon - Fri: 6:00 AM - 8:00 PM',
      'footer.schedule.saturday': 'Sat: 6:00 AM - 10:00 PM',
      'footer.schedule.sunday': 'Sun: 7:00 AM - 6:00 PM',
      
      // Common
      'common.learnMore': 'Learn More',
      'common.viewAll': 'View All',
      'common.addToCart': 'Add to Cart',
      'common.buyNow': 'Buy Now',
      'common.close': 'Close',
      'common.loading': 'Loading...'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // idioma por defecto
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false
    },
    
    // Detectar y guardar en localStorage
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'bakehaus-language'
    }
  });

export default i18n;