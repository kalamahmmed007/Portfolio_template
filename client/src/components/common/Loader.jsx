import React from 'react';

const Loader = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-[6px]',
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        {/* Main spinner */}
        <div
          className={`${sizeClasses[size]} border-red-600 border-t-red-400 rounded-full animate-spin`}
        ></div>
        
        {/* Glow effect */}
        <div
          className={`${sizeClasses[size]} border-red-500/30 border-t-transparent rounded-full animate-spin absolute top-0 left-0 blur-sm`}
        ></div>
      </div>
    </div>
  );
};

export default Loader;