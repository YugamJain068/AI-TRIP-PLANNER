'use client';
import React from 'react';

const BlurAreaLoader = ({ className = '' }) => {
  return (
    <div
      className={`absolute top-0 left-0 w-full h-full z-10 animate-blurFade bg-white/40 backdrop-blur-sm rounded-xl ${className}`}
    >
      <div className="flex items-center justify-center h-full text-sm text-gray-700 font-medium opacity-80">
        Loading...
      </div>
    </div>
  );
};

export default BlurAreaLoader;
