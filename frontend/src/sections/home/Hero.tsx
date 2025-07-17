import React from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Star, ShoppingBag, Play, Heart, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-200/50 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">Desde 1995 • Calidad Premium</span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-none tracking-tight">
                Dulce
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Esquina
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-light">
                Productos artesanales que endulzan tu vida con sabores únicos y tradición familiar.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="xl" className="group shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0">
                <ShoppingBag className="w-5 h-5 mr-3" />
                Explorar Productos
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="xl" className="group border-slate-300 hover:border-slate-400 bg-white/50 backdrop-blur-sm">
                <Play className="w-5 h-5 mr-3" />
                Nuestra Historia
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-slate-600 font-medium">4.9/5 • 1,200+ reseñas</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="text-sm text-slate-600 font-medium">5,000+ clientes</span>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            {/* Main Product Card */}
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                
                {/* Product Image */}
                <div className="relative mb-6">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200/40 to-pink-200/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-orange-300 to-pink-300 rounded-full shadow-lg flex items-center justify-center">
                        <Award className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-lg">
                    <span className="text-xs font-bold">¡NUEVO!</span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Pan de Canela Premium</h3>
                      <p className="text-slate-600">Receta tradicional familiar</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-500">Q25</div>
                      <div className="text-sm text-slate-500">por unidad</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600 font-medium">(4.9) • 150+ reseñas</span>
                  </div>
                  
                  <Button variant="primary" fullWidth className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 shadow-lg">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Añadir al Carrito
                  </Button>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-xl shadow-lg transform rotate-12">
                <div className="text-xs font-bold">Envío Gratis</div>
                <div className="text-xs opacity-90">Pedidos +Q100</div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl shadow-lg transform -rotate-12">
                <div className="text-xs font-bold">Oferta Especial</div>
                <div className="text-xs opacity-90">20% OFF</div>
              </div>
            </div>

            {/* Floating Mini Cards */}
            <div className="absolute top-20 -left-8 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Calidad Premium</div>
                  <div className="text-xs text-slate-600">Ingredientes naturales</div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-32 -right-8 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Hecho con Amor</div>
                  <div className="text-xs text-slate-600">Tradición familiar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};