import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-animate opacity-50"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
    </div>
  );
};

export default AnimatedBackground;