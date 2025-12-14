import React from 'react';
import type { FreshnessData } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Clock, Thermometer, Info, Leaf, Utensils, ChefHat, Sparkles } from 'lucide-react';

interface AnalysisResultProps {
  data: FreshnessData;
  reset: () => void;
  imageSrc?: string;
}

// Helper untuk menormalisasi nilai 0-1 (desimal) menjadi 0-100 (persen)
const normalizeValue = (val: number | undefined): number => {
  if (val === undefined || val === null) return 0;
  // Jika nilai <= 1 (misal 0.98), kita anggap itu desimal dan dikali 100 (jadi 98)
  // Logika ini menangani kasus di mana AI mengembalikan float 0.0 - 1.0
  if (val <= 1) return Math.round(val * 100);
  return Math.round(val);
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, reset, imageSrc }) => {
  if (!data.isFood) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-brand-orange/20 text-center max-w-md mx-auto animate-fade-in">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-2xl font-display font-bold text-brand-dark mb-2">Bukan Makanan?</h3>
        <p className="text-gray-600 mb-6 font-sans">
          AI kami tidak mendeteksi buah atau sayuran dalam gambar ini. Mohon unggah gambar produk segar yang jelas.
        </p>
        <button
          onClick={reset}
          className="bg-brand-orange text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors w-full"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // 1. Normalisasi Data (Perbaikan Utama)
  const score = normalizeValue(data.freshnessScore);
  const confidence = normalizeValue(data.confidence);

  // Determine color based on normalized score
  let scoreColor = "text-green-600";
  let strokeColor = "text-green-500";
  let barColor = "bg-green-100 text-green-800";
  let Icon = CheckCircle;

  if (score < 50) {
    scoreColor = "text-red-600";
    strokeColor = "text-red-500";
    barColor = "bg-red-100 text-red-800";
    Icon = XCircle;
  } else if (score < 80) {
    scoreColor = "text-brand-orange";
    strokeColor = "text-brand-orange";
    barColor = "bg-orange-100 text-orange-800";
    Icon = AlertTriangle;
  }

  // Circular Progress Logic
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Use normalized score for progress
  const progress = score; 
  const dashoffset = circumference - (progress / 100) * circumference;

  // Defensive coding: Pastikan array selalu ada
  const visuals = data.visualIndicators || [];
  const suggestions = data.cookingSuggestions || [];

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in-up pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT COLUMN: Image, Visuals, Nutrition --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Image Card */}
          <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white aspect-[3/4] group">
            <img 
              src={imageSrc} 
              alt="Analyzed Item" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm z-10">
              <span className="text-brand-dark font-bold font-display tracking-wider uppercase text-xs">Hasil Analisis</span>
            </div>
          </div>

          {/* Visual Analysis Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
             <h3 className="font-display font-bold text-lg text-brand-dark mb-4 flex items-center gap-2">
              <Leaf className="text-brand-dark" size={20} />
              Analisis Visual
            </h3>
            <ul className="space-y-3">
              {visuals.length > 0 ? visuals.map((indicator, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                  <span className="text-gray-600 font-medium text-sm leading-snug">{indicator}</span>
                </li>
              )) : (
                <li className="text-gray-400 italic text-sm">Tidak ada indikator visual spesifik.</li>
              )}
            </ul>
          </div>

          {/* Nutrition Card */}
          <div className="bg-brand-dark text-white rounded-[2rem] p-6 shadow-lg relative overflow-hidden">
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-green rounded-full opacity-20"></div>
             <div className="relative z-10">
                <h4 className="font-bold text-brand-orange mb-2 flex items-center gap-2 text-base">
                  <Info size={18} /> Highlight Nutrisi
                </h4>
                <p className="text-white/80 leading-relaxed text-sm font-light">{data.nutritionHighlights || "Data nutrisi tidak tersedia."}</p>
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Stats, Storage, Kitchen --- */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Status Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-md border border-gray-100">
             <div className="mb-6">
               <h2 className="text-4xl font-display font-bold text-brand-dark mb-2">{data.itemName}</h2>
               <p className="text-gray-500 text-base leading-relaxed">{data.shortDescription}</p>
             </div>
             
             <div className="h-px bg-gray-100 w-full mb-6"></div>

             <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Gauge */}
                <div className="relative w-36 h-36 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="#f3f4f6" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashoffset} className={`${strokeColor} transition-all duration-1000 ease-out`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Menggunakan nilai 'score' yang sudah dinormalisasi */}
                    <span className={`text-3xl font-display font-bold ${scoreColor}`}>{score}%</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Segar</span>
                  </div>
                </div>

                {/* Stats List */}
                <div className="flex flex-col gap-3 w-full">
                   {/* Freshness Label */}
                   <div className={`py-3 px-4 rounded-xl ${barColor} font-bold flex items-center gap-3 text-sm`}>
                      <Icon size={18} />
                      {data.freshnessLabel}
                   </div>
                   
                   {/* Ripeness */}
                   <div className="py-3 px-4 rounded-xl bg-brand-dark text-white border border-brand-green/20 font-medium flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></div>
                      <span className="opacity-70 text-xs uppercase tracking-wider w-20">Kematangan</span>
                      <span className="font-bold">{data.ripenessLevel}</span>
                   </div>

                   {/* Confidence (Perbaikan Tampilan) */}
                   <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                      <Sparkles size={16} className="text-brand-orange" />
                      <span className="text-xs font-bold text-gray-400 uppercase w-20">Akurasi AI</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        {/* Menggunakan nilai 'confidence' yang sudah dinormalisasi */}
                        <div className="bg-brand-orange h-full rounded-full transition-all duration-1000" style={{ width: `${confidence}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-brand-dark">{confidence}%</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Storage Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-brand-cream rounded-[2rem] p-6 border border-brand-green/5">
              <div className="flex items-center gap-2 mb-2 text-brand-green">
                <Clock size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Umur Simpan</span>
              </div>
              <p className="text-brand-dark font-bold text-lg leading-tight">{data.shelfLife}</p>
            </div>
            <div className="bg-brand-cream rounded-[2rem] p-6 border border-brand-green/5">
              <div className="flex items-center gap-2 mb-2 text-brand-green">
                <Thermometer size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Penyimpanan</span>
              </div>
              <p className="text-brand-dark font-medium text-sm leading-snug">{data.storageAdvice}</p>
            </div>
          </div>

          {/* Kitchen & Recipe Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-md border border-gray-100 flex flex-col gap-6">
             <div className="flex items-center gap-3">
                <div className="bg-brand-orange/10 p-2.5 rounded-xl text-brand-orange">
                  <ChefHat size={24} />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-dark">Rekomendasi Dapur</h3>
             </div>

             {/* Suggestions */}
             <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Saran Pengolahan</span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.length > 0 ? suggestions.map((sugg, idx) => (
                    <span key={idx} className="bg-gray-50 text-brand-dark border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                      {sugg}
                    </span>
                  )) : (
                     <span className="text-gray-400 text-xs italic">Tidak ada saran khusus.</span>
                  )}
                </div>
             </div>

             {/* Recipe Box */}
             <div className="bg-brand-dark rounded-2xl p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Utensils size={64} />
                </div>
                
                <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-2 block">Ide Resep Spesial</span>
                <h4 className="text-xl font-display font-bold mb-3">{data.recipeName || "Resep Umum"}</h4>
                <p className="text-sm text-gray-300 leading-relaxed font-light relative z-10">
                  {data.recipeInstructions || "Silakan olah sesuai selera Anda."}
                </p>
             </div>
          </div>

          {/* Action Button */}
          <button
            onClick={reset}
            className="w-full group flex items-center justify-center gap-3 bg-white border-2 border-brand-dark text-brand-dark px-6 py-4 rounded-2xl font-bold hover:bg-brand-dark hover:text-white transition-all shadow-sm hover:shadow-lg mt-2"
          >
            <span>Analisis Item Lain</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
};