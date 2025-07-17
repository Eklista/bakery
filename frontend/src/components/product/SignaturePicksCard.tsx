import React from 'react';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export const SignaturePicksCard: React.FC = () => {
  return (
    <div className="bg-pink-200 rounded-3xl p-6 relative overflow-hidden">
      {/* Arrow Icon */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <ArrowRight className="w-4 h-4 text-white" />
      </div>
      
      <div className="space-y-4">
        {/* Made to Order Button */}
        <Button
          variant="outline"
          size="sm"
          className="border-gray-400 text-gray-700 hover:bg-white/50 px-4 py-2 rounded-full text-sm"
        >
          Made to Order
        </Button>
        
        {/* Content */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Explore Our Signature Picks
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Decadent desserts, handcrafted to match every craving. 🍰
          </p>
        </div>
      </div>
    </div>
  );
};