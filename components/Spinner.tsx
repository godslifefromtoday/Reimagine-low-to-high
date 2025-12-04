import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-500/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-brand-400 font-medium animate-pulse">Thinking like a Nano Banana...</p>
    </div>
  );
};

export default Spinner;
