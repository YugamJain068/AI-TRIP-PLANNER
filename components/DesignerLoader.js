import React from 'react';

const DesignerLoader = () => {
  return (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-[#F99262] border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-blue-500 border-b-transparent rounded-full animate-spin-reverse"></div>
      </div>
  );
};

export default DesignerLoader;