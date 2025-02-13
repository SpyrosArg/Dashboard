import React from 'react';
import { Network } from 'lucide-react';

const GlobeVisualization = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00f2ea]/10 to-[#00b4d8]/10 rounded-lg" />
      <div className="relative z-10 text-center">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00f2ea] to-[#00b4d8] p-[2px]">
          <div className="w-full h-full rounded-full bg-[#0a1929] flex items-center justify-center">
            <Network className="w-16 h-16 text-[#00f2ea]" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Global Security Network</h3>
        <p className="text-white/70">Monitoring and protecting worldwide connections</p>
      </div>
      
      {/* Animated dots representing network nodes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#00f2ea] rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Animated lines representing connections */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2ea" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
        </defs>
        {[...Array(6)].map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = Math.random() * 100;
          const y2 = Math.random() * 100;
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              strokeDasharray="5,5"
              className="animate-dash"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default GlobeVisualization;