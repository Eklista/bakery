import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-text text-background">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-accent">Dulce Esquina</h3>
            <p className="text-background/80 text-sm leading-relaxed">
              Endulzando tu vida con productos artesanales hechos con amor y tradición desde 1995.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="text-background/60 hover:text-accent transition-colors p-2 rounded-full hover:bg-primary/10"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-background/60 hover:text-accent transition-colors p-2 rounded-full hover:bg-primary/10"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-background/60 hover:text-accent transition-colors p-2 rounded-full hover:bg-primary/10"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-accent">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-accent mt-1 flex-shrink-0" />
                <span className="text-background/80 text-sm">
                  Av. Principal 123<br />
                  Ciudad de Guatemala
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <span className="text-background/80 text-sm">+502 1234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <span className="text-background/80 text-sm">info@dulceesquina.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-accent">Horarios</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Clock size={16} className="text-accent mt-1 flex-shrink-0" />
                <div className="text-background/80 text-sm">
                  <div>Lun - Vie: 6:00 - 20:00</div>
                  <div>Sáb: 6:00 - 22:00</div>
                  <div>Dom: 7:00 - 18:00</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-accent">Enlaces</h4>
            <div className="space-y-2">
              <a href="#about" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Nosotros
              </a>
              <a href="#products" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Productos
              </a>
              <a href="#events" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Eventos
              </a>
              <a href="#contact" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Contacto
              </a>
              <a href="#" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © 2024 Dulce Esquina. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};