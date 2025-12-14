import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { Logo } from './components/Logo';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeImageFreshness } from './services/geminiService';
import type { AnalysisState } from './types';

function App() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    
    setAnalysisState({
      status: 'analyzing',
      data: null,
      imagePreview: objectUrl
    });

    try {
      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          // Panggil service
          const result = await analyzeImageFreshness(base64String, file.type);
          setAnalysisState({
            status: 'success',
            data: result,
            imagePreview: objectUrl
          });
        } catch (err) {
          console.error("Analysis Error Details:", err);
          setAnalysisState({
            status: 'error',
            data: null,
            error: err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi AI.",
            imagePreview: objectUrl
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setAnalysisState({
        status: 'error',
        data: null,
        error: "Gagal memproses file gambar.",
        imagePreview: objectUrl
      });
    }
  };

  const triggerInput = () => fileInputRef.current?.click();

  const resetApp = () => {
    setAnalysisState({ status: 'idle', data: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      {/* Navbar */}
      <nav className="bg-brand-cream/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-dark/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Logo variant="dark" className="h-10 md:h-12" />
          <div className="hidden md:flex gap-6 text-brand-dark font-bold text-sm tracking-wide">
            <a href="#" className="hover:text-brand-orange transition-colors">BERANDA</a>
            <a href="#" className="hover:text-brand-orange transition-colors">TENTANG KAMI</a>
            <a href="#" className="hover:text-brand-orange transition-colors">KONTAK</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8 md:py-12">
        
        {/* Header Section (Only show if idle or analyzing) */}
        {(analysisState.status === 'idle' || analysisState.status === 'analyzing') && (
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-4 leading-tight">
              Makan <span className="text-brand-orange underline decoration-4 decoration-brand-green/30">Segar</span>, <br/>
              Hidup Lebih Sehat.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Teknologi AI Freshlyze membantu Anda memastikan kualitas buah dan sayuran dalam hitungan detik. Cukup foto, dan kami akan menganalisisnya.
            </p>
          </div>
        )}

        {/* Upload Area (Only show if idle) */}
        {analysisState.status === 'idle' && (
          <div className="max-w-xl mx-auto animate-fade-in-up">
            <div 
              onClick={triggerInput}
              className="group cursor-pointer bg-white border-4 border-dashed border-brand-green/20 rounded-[2.5rem] p-10 text-center hover:border-brand-orange hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Decorative circle */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-brand-cream rounded-full transition-transform group-hover:scale-150 duration-500"></div>

              <div className="relative z-10">
                <div className="w-24 h-24 bg-brand-cream text-brand-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 shadow-inner">
                  <Camera size={40} />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2">Ambil Foto atau Upload</h3>
                <p className="text-gray-500 mb-8">Format JPG, PNG didukung.</p>
                
                <button className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold shadow-lg group-hover:bg-brand-green transition-colors flex items-center gap-2 mx-auto">
                  <Upload size={18} />
                  <span>Pilih Gambar</span>
                </button>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Analisis Cepat", icon: "⚡" },
                { label: "Akurasi AI", icon: "🤖" },
                { label: "Info Nutrisi", icon: "🥗" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-brand-green/5">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs font-bold text-brand-dark uppercase tracking-wide">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {analysisState.status === 'analyzing' && (
          <div className="max-w-md mx-auto text-center mt-8">
            <div className="relative w-64 h-64 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-brand-white">
              <img 
                src={analysisState.imagePreview} 
                alt="Analyzing" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-brand-dark/30 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white/90 p-4 rounded-full shadow-xl">
                  <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                </div>
              </div>
              {/* Scanning bar effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange shadow-[0_0_15px_rgba(244,157,26,0.8)] animate-scan"></div>
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-dark animate-pulse">
              Sedang Menganalisis...
            </h2>
            <p className="text-gray-500 mt-2">AI sedang mengecek tekstur dan warna.</p>
          </div>
        )}

        {/* Results */}
        {analysisState.status === 'success' && analysisState.data && (
          <div className="space-y-8">
            {/* Image is now passed inside the component for better layout control */}
            <AnalysisResult 
              data={analysisState.data} 
              reset={resetApp} 
              imageSrc={analysisState.imagePreview} 
            />
          </div>
        )}

        {/* Error State */}
        {analysisState.status === 'error' && (
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl shadow-xl border border-red-100 mt-10">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8" /> 
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Ups, ada masalah!</h3>
            <p className="text-gray-600 mb-6">{analysisState.error}</p>
            <button 
              onClick={resetApp}
              className="text-brand-orange font-bold hover:underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*"
        />
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12 mt-auto relative overflow-hidden">
        {/* Abstract leaf shape decoration in footer */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-green rounded-full opacity-30"></div>
        
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
             <Logo variant="white" className="h-14" />
          </div>
          <p className="text-brand-cream/60 max-w-md mx-auto mb-8">
            Membantu Anda memilih bahan makanan terbaik untuk kesehatan keluarga.
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="hover:text-brand-orange transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Facebook</a>
          </div>
          <div className="border-t border-brand-green/30 pt-8 text-sm text-brand-cream/40">
            &copy; {new Date().getFullYear()} Freshlyze. Powered by Gemini AI.
          </div>
        </div>
      </footer>

      {/* Tailwind Custom Animations */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;