import React from 'react';
import { SignaturePicksCard } from '../../components/product/SignaturePicksCard';
import { CategoriesCard } from '../../components/product/CategoriesCard';

export const Hero: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
          
          {/* Left Section - Main Card */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[600px]">
              {/* Card principal con imagen de fondo */}
              <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-xl relative">
                <img 
                  src="/macaroon.png" 
                  alt="Macaroon"
                  className="w-full h-full object-cover"
                />
                
                {/* Label flotante superpuesto */}
                <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-lg p-4">
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    Ordena Tu
                    <br />
                    <span className="text-blue-600">Postre</span>
                    <br />
                    Soñado
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - CTA Cards */}
          <div className="flex items-center">
            <div className="space-y-6 w-full">
              <SignaturePicksCard />
              <CategoriesCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};