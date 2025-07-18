// src/views/Home.tsx
import React, { lazy } from 'react';
import { LazySection } from '../components/LazySection';
import { Hero } from '../sections/home/Hero';

const About = lazy(() => import('../sections/home/About').then(module => ({ default: module.About })));
const Products = lazy(() => import('../sections/home/Products').then(module => ({ default: module.Products })));

export const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      
      <LazySection delay={0.2}>
        <React.Suspense fallback={
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        }>
          <About />
        </React.Suspense>
      </LazySection>
      
      <LazySection delay={0.4}>
        <React.Suspense fallback={
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        }>
          <Products />
        </React.Suspense>
      </LazySection>
    </div>
  );
};