
import React from 'react';

const SkillBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Main branches visual indication */}
      <div className="absolute top-[30%] left-[20%] w-[45%] h-[1px] bg-red-500/20"></div>
      <div className="absolute top-[50%] left-[20%] w-[45%] h-[1px] bg-blue-500/20"></div>
      <div className="absolute top-[30%] left-[35%] w-[45%] h-[1px] bg-purple-500/20"></div>
    </div>
  );
};

export default SkillBackground;
