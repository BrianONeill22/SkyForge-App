import React from 'react';

export default function WuuthradBannerIcon({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 6H52V44L32 58L12 44V6Z"
        fill="#7f1d1d"
        stroke="#d97706"
        strokeWidth="3"
      />
      <path
        d="M16 10H48V41.5L32 52.8L16 41.5V10Z"
        stroke="#fbbf24"
        strokeWidth="1.2"
        strokeOpacity="0.65"
      />
      <path d="M32 14V45" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M32 19C25 16 20 18 19 24C20 30 25 32 32 29C39 32 44 30 45 24C44 18 39 16 32 19Z"
        fill="#fbbf24"
        fillOpacity="0.9"
      />
    </svg>
  );
}
