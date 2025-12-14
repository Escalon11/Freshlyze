import React, { useState } from 'react';

interface LogoProps {
  variant?: 'dark' | 'light' | 'white';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = "h-12" }) => {
  // State untuk melacak apakah gambar gagal dimuat
  const [imgError, setImgError] = useState(false);
  
  const isFooter = variant === 'white';
  // Pastikan Anda menaruh file logo.png di folder public/
  const logoSrc = isFooter ? "/logo-white.png" : "/logo.png";

  // Skenario 1: Jika gambar GAGAL dimuat (Error), tampilkan Icon Daun + Teks sebagai gantinya.
  if (imgError) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
         <div className={`flex items-center justify-center h-full aspect-square rounded-lg ${isFooter ? 'bg-white/10 text-white' : 'bg-brand-green/10 text-brand-green'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3/4 h-3/4">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
            <path d="M12 15a6 6 0 1 0-8.48-8.48L5 8"/>
            <path d="M10 8c1.33 0 2.5.5 3.5 1.5"/>
            <path d="M15 12a6 6 0 1 1 8.48 8.48L22 22"/>
            <path d="M19 16c0 1.33-.5 2.5-1.5 3.5"/>
          </svg>
        </div>
        <span className={`font-display font-bold text-xl tracking-tight ${isFooter ? 'text-white' : 'text-brand-dark'}`}>
          Freshlyze
        </span>
      </div>
    );
  }

  // Skenario 2: Normal. Tampilkan HANYA gambar logo.
  // Tidak ada teks tambahan di sampingnya.
  return (
    <div className={className}>
      <img 
        src={logoSrc} 
        alt="Freshlyze Logo" 
        className="h-full w-auto object-contain"
        onError={() => setImgError(true)}
      />
    </div>
  );
};