import React from 'react';

/**
 * Premium skeleton placeholder loader.
 * Supports various shapes and responsive classes via standard className prop.
 */
export const Skeleton = ({ 
  className = '', 
  variant = 'text', 
  width, 
  height 
}) => {
  const baseStyle = 'bg-slate-200 dark:bg-slate-800/80 animate-pulse transition-colors duration-200';
  
  const variants = {
    text: 'h-3 w-full rounded-md',
    title: 'h-5 w-3/4 rounded-lg',
    circle: 'rounded-full shrink-0',
    rectangle: 'rounded-2xl w-full',
  };

  const inlineStyles = {};
  if (width) inlineStyles.width = width;
  if (height) inlineStyles.height = height;

  return (
    <div
      className={`${baseStyle} ${variants[variant] || variants.text} ${className}`}
      style={inlineStyles}
    />
  );
};

export default Skeleton;
