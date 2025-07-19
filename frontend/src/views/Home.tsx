// src/views/Home.tsx
import React, { lazy } from 'react';
import { LazySection } from '../components/LazySection';
import { SectionSeparator } from '../components/ui/SectionSeparator';
import { Hero } from '../sections/home/Hero';

const About = lazy(() => import('../sections/home/About').then(module => ({ default: module.About })));
const Products = lazy(() => import('../sections/home/Products').then(module => ({ default: module.Products })));
const Testimonials = lazy(() => import('../sections/home/Testimonials').then(module => ({ default: module.Testimonials })));
const CallToAction = lazy(() => import('../sections/home/CallToAction').then(module => ({ default: module.CallToAction })));

export const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      
      <SectionSeparator 
        variant="dotted-line" 
        color="amber" 
        size="lg" 
      />
      
      <LazySection delay={0.2}>
        <React.Suspense fallback={
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        }>
          <About />
        </React.Suspense>
      </LazySection>
      
      <SectionSeparator 
        variant="dots" 
        color="neutral" 
        size="md" 
      />
      
      <LazySection delay={0.4}>
        <React.Suspense fallback={
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        }>
          <Products />
        </React.Suspense>
      </LazySection>
      
      <SectionSeparator 
        variant="dashed" 
        color="light" 
        size="md" 
      />
      
      <LazySection delay={0.6}>
        <React.Suspense fallback={
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        }>
          <Testimonials />
        </React.Suspense>
      </LazySection>
      
      <SectionSeparator 
        variant="line" 
        color="amber" 
        size="sm" 
      />
      
      <LazySection delay={0.8}>
        <React.Suspense fallback={
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        }>
          <CallToAction />
        </React.Suspense>
      </LazySection>
    </div>
  );
};