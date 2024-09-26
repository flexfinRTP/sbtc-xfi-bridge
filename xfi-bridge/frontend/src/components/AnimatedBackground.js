import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-animate opacity-20"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
    </div>
  );
};

export default AnimatedBackground;