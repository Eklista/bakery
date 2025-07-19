// src/components/ui/SectionSeparator.tsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface SectionSeparatorProps {
  variant?: 'dots' | 'line' | 'dashed' | 'dotted-line';
  color?: 'amber' | 'neutral' | 'gray' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DotsPattern = memo(({ color }: { color: string }) => {
  const dots = Array.from({ length: 3 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center space-x-4">
      {dots.map((_, index) => (
        <motion.div
          key={index}
          className={`w-2.5 h-2.5 rounded-full ${color}`}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          viewport={{ once: true }}
        />
      ))}
    </div>
  );
});

const LinePattern = memo(({ color }: { color: string }) => (
  <motion.div
    className={`h-0.5 ${color} w-32 mx-auto rounded-full`}
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
  />
));

const DashedPattern = memo(({ color }: { color: string }) => (
  <div className="flex items-center justify-center space-x-2">
    {Array.from({ length: 5 }, (_, index) => (
      <motion.div
        key={index}
        className={`h-0.5 w-4 ${color} rounded-full`}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ 
          duration: 0.3, 
          delay: index * 0.1,
          ease: "easeOut"
        }}
        viewport={{ once: true }}
      />
    ))}
  </div>
));

const DottedLinePattern = memo(({ color }: { color: string }) => (
  <div className="flex items-center justify-center space-x-3">
    <motion.div
      className={`h-0.5 w-12 ${color} rounded-full`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
    />
    <motion.div
      className={`w-2 h-2 rounded-full ${color.replace('bg-', 'bg-')}`}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
      viewport={{ once: true }}
    />
    <motion.div
      className={`h-0.5 w-12 ${color} rounded-full`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
      viewport={{ once: true }}
    />
  </div>
));

export const SectionSeparator: React.FC<SectionSeparatorProps> = memo(({
  variant = 'dots',
  color = 'neutral',
  size = 'md',
  className = ""
}) => {
  const colorClasses = {
    amber: 'bg-amber-500',
    neutral: 'bg-neutral-400',
    gray: 'bg-gray-500',
    light: 'bg-gray-300'
  };

  const sizeClasses = {
    sm: 'py-6',
    md: 'py-8',
    lg: 'py-12'
  };

  const currentColor = colorClasses[color];
  const currentSize = sizeClasses[size];

  const renderPattern = () => {
    switch (variant) {
      case 'dots':
        return <DotsPattern color={currentColor} />;
      case 'line':
        return <LinePattern color={currentColor} />;
      case 'dashed':
        return <DashedPattern color={currentColor} />;
      case 'dotted-line':
        return <DottedLinePattern color={currentColor} />;
      default:
        return <DotsPattern color={currentColor} />;
    }
  };

  return (
    <div className={`${currentSize} flex items-center justify-center ${className}`}>
      {renderPattern()}
    </div>
  );
});