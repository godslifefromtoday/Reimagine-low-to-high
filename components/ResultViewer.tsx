import React, { useState } from 'react';
import { Download, ArrowLeft, Maximize2, X } from 'lucide-react';

interface ResultViewerProps {
  originalImageSrc: string;
  processedImageSrc: string;
  onReset: () => void;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ originalImageSrc, processedImageSrc, onReset }) => {
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'processed'>('processed');
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string>('');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImageSrc;
    link.download = `nano-banana-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = (src: string) => {
    setModalImage(src);
    setShowModal(true);
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
        {/* Modal for full screen view */}
        {showModal && (
            <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                <button className="absolute top-4 right-4 text-white hover:text-brand-500 p-2">
                    <X className="w-8 h-8" />
                </button>
                <img src={modalImage} alt="Full view" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
            </div>
        )}

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-card p-4 rounded-xl border border-dark-border">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-dark-muted hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit Another
        </button>
        
        <div className="flex bg-dark-bg p-1 rounded-lg border border-dark-border">
            <button 
                onClick={() => setViewMode('original')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'original' ? 'bg-dark-card text-white shadow-sm' : 'text-dark-muted hover:text-white'}`}
            >
                Original
            </button>
            <button 
                onClick={() => setViewMode('processed')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'processed' ? 'bg-brand-600 text-white shadow-sm' : 'text-dark-muted hover:text-white'}`}
            >
                Result
            </button>
        </div>

        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Image Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px] md:h-[600px]">
        {/* Original */}
        <div className={`relative group rounded-2xl overflow-hidden border border-dark-border bg-dark-card ${viewMode === 'processed' ? 'hidden md:block' : ''} ${viewMode === 'original' ? 'col-span-1 md:col-span-2' : ''}`}>
           <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium z-10">
                Original
           </div>
           <button onClick={() => openModal(originalImageSrc)} className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Maximize2 className="w-4 h-4" />
           </button>
           <img 
            src={originalImageSrc} 
            alt="Original" 
            className="w-full h-full object-contain p-4"
           />
        </div>

        {/* Processed */}
        <div className={`relative group rounded-2xl overflow-hidden border-2 border-brand-500/20 bg-dark-card ${viewMode === 'original' ? 'hidden md:block' : ''} ${viewMode === 'processed' ? 'col-span-1 md:col-span-2' : ''}`}>
            <div className="absolute inset-0 bg-brand-500/5 pointer-events-none"></div>
            <div className="absolute top-3 left-3 bg-brand-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium z-10 shadow-lg shadow-brand-500/20">
                Processed AI
           </div>
           <button onClick={() => openModal(processedImageSrc)} className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Maximize2 className="w-4 h-4" />
           </button>
           <img 
            src={processedImageSrc} 
            alt="Processed" 
            className="w-full h-full object-contain p-4"
           />
        </div>
      </div>
    </div>
  );
};

export default ResultViewer;
