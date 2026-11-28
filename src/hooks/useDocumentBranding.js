import { useEffect } from 'react';

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path d="M12 6H52V44L32 58L12 44V6Z" fill="#7f1d1d" stroke="#d97706" stroke-width="3"/>
  <path d="M32 14V45" stroke="#fcd34d" stroke-width="3" stroke-linecap="round"/>
  <path d="M32 19C25 16 20 18 19 24C20 30 25 32 32 29C39 32 44 30 45 24C44 18 39 16 32 19Z" fill="#fbbf24"/>
</svg>`;

export function useDocumentBranding() {
  useEffect(() => {
    document.title = 'The Skyforge';
    const svgIcon = encodeURIComponent(FAVICON_SVG);
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = `data:image/svg+xml,${svgIcon}`;
  }, []);
}
