import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// React Error Boundary (Menangkap error saat render dengan aman)
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("React Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-red-100 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12.01" y1="8" y2="8"/><line x1="12" x2="12.01" y1="12" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <h1 className="text-2xl font-display font-bold text-brand-dark mb-2">Aplikasi Terhenti</h1>
            <p className="text-gray-600 mb-6">Maaf, terjadi kesalahan teknis. Silakan coba muat ulang.</p>
            
            <details className="mb-6 text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
              <summary className="text-xs font-bold text-gray-400 uppercase cursor-pointer hover:text-brand-orange">Lihat Detail Error</summary>
              <pre className="mt-2 text-xs text-red-800 font-mono whitespace-pre-wrap overflow-auto max-h-32">
                {this.state.error?.message}
              </pre>
            </details>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-brand-green transition-colors"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Element root tidak ditemukan di index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);