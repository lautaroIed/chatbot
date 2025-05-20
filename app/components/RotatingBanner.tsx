import { useState, useEffect } from 'react';
import { bannerData, BannerItem } from '../data/bannerData';

export function RotatingBanner() {
  const [currentBanner, setCurrentBanner] = useState<BannerItem | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bannerData.length);
    setCurrentBanner(bannerData[randomIndex]);
  }, []);

  if (!currentBanner) return null;

  return (
    <div className="bg-blue-600 text-white py-2 px-4 text-center">
      <a href={currentBanner.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {currentBanner.text}
      </a>
    </div>
  );
}

