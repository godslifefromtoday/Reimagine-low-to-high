import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';
import ResultViewer from './components/ResultViewer';
import { editImageWithGemini, fileToBase64 } from './services/gemini';
import { AppState, PresetPrompt } from './types';
import { Wand2, ImagePlus, History, AlertCircle } from 'lucide-react';

const PRESETS: PresetPrompt[] = [
  {
    label: 'High Quality Portrait',
    text: 'Enhance this image to high quality DSLR portrait, improve skin texture, hair details, lighting, strict consistency with original face and pose.',
    icon: '✨'
  },
  {
    label: 'Cyberpunk Vibe',
    text: 'Give this image a futuristic cyberpunk neon aesthetic with blue and pink lighting, while keeping the subject recognizable.',
    icon: '🌃'
  },
  {
    label: 'Professional Studio',
    text: 'Change background to a clean professional dark studio backdrop, soft rim lighting, high contrast.',
    icon: '📸'
  },
  {
    label: 'Sketch Style',
    text: 'Convert this image into a high detail pencil sketch drawing.',
    icon: '✏️'
  }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string>('');
  const [resultImage, setResultImage] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (originalImagePreview) URL.revokeObjectURL(originalImagePreview);
    };
  }, [originalImagePreview]);

  const handleImageSelected = (file: File) => {
    setOriginalImage(file);
    setOriginalImagePreview(URL.createObjectURL(file));
    setState(AppState.READY_TO_EDIT);
    setError('');
  };

  const handleReset = () => {
    setState(AppState.IDLE);
    setOriginalImage(null);
    setOriginalImagePreview('');
    setResultImage('');
    setPrompt('');
    setError('');
  };

  const handleGenerate = async () => {
    if (!originalImage || !prompt.trim()) return;

    setState(AppState.PROCESSING);
    setError('');

    try {
      const base64 = await fileToBase64(originalImage);
      const result = await editImageWithGemini(base64, originalImage.type, prompt);
      
      setResultImage(`data:${result.mimeType};base64,${result.data}`);
      setState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while processing the image.');
      setState(AppState.ERROR); // Or keep in READY_TO_EDIT but show error
    }
  };

  const handlePresetClick = (presetText: string) => {
    setPrompt(presetText);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
        
        {state === AppState.IDLE && (
          <div className="max-w-2xl mx-auto mt-12 animate-fade-in-up">
             <div className="text-center mb-10 space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-dark-muted">
                    Reimagine Reality
                </h2>
                <p className="text-dark-muted text-lg max-w-lg mx-auto">
                    Upload an image and use natural language to edit it with the power of Gemini 2.5 Flash Image.
                </p>
             </div>
            <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        )}

        {(state === AppState.READY_TO_EDIT || state === AppState.PROCESSING || state === AppState.ERROR) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Panel: Preview & Inputs */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Image Preview Card */}
              <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden p-4 shadow-xl">
                <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-black/50">
                    <img 
                      src={originalImagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                    <button 
                        onClick={handleReset}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 text-white p-2 rounded-full transition-colors"
                        title="Remove image"
                    >
                        <History className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-brand-900/10 border border-brand-900/20 rounded-xl">
                 <h4 className="flex items-center gap-2 text-brand-400 font-medium mb-2">
                    <AlertCircle className="w-4 h-4" />
                    Tips
                 </h4>
                 <p className="text-sm text-brand-200/70">
                    Be specific about what you want to change. Mention lighting, style, or specific objects to add/remove.
                 </p>
              </div>
            </div>

            {/* Right Panel: Controls */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-white font-semibold text-lg">
                    <Wand2 className="w-5 h-5 text-brand-500" />
                    <span>Magic Editor</span>
                </div>

                <div className="space-y-4 flex-1">
                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-2">Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your edit (e.g., 'Add a pair of sunglasses', 'Make it look like a vintage photo')..."
                            className="w-full h-32 bg-dark-bg border border-dark-border rounded-lg p-4 text-white placeholder-dark-muted/50 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-all"
                            disabled={state === AppState.PROCESSING}
                        />
                    </div>

                    {/* Presets */}
                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-2">Quick Presets</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePresetClick(preset.text)}
                                    disabled={state === AppState.PROCESSING}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-dark-border bg-dark-bg hover:bg-dark-border/50 hover:border-brand-500/50 transition-all group"
                                >
                                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{preset.icon}</span>
                                    <span className="text-[10px] text-center text-dark-muted group-hover:text-white font-medium">{preset.label}</span>
                                </button>
                            ))}
                        </div>
                        {/* Special User Requested Preset */}
                         <button
                            onClick={() => handlePresetClick("첨부 사진의 얼굴, 표정, 헤어, 포즈, 형태 엄격히 일관성을 유지하면서 다음의 명령을 수행, Ensure face, emotion, camera angle, pose strict consistency with the reference image[no change]. 화질개선, 옷질감 피부결, 눈썹, 머리결, 동공반사, 디테일업, 고화질 dslr, ai느낌이 아닌 실제 사람 사진")}
                            disabled={state === AppState.PROCESSING}
                            className="w-full mt-2 py-2 px-3 rounded-lg border border-brand-500/30 bg-brand-500/5 hover:bg-brand-500/10 text-brand-400 text-xs font-medium transition-colors text-left flex items-center gap-2"
                        >
                            <span className="text-lg">🍌</span>
                            High Fidelity Enhancement (Nano Banana Mode)
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                             <AlertCircle className="w-4 h-4 shrink-0" />
                             {error}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || state === AppState.PROCESSING}
                        className={`
                            w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/20
                            ${!prompt.trim() || state === AppState.PROCESSING 
                                ? 'bg-dark-border text-dark-muted cursor-not-allowed' 
                                : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white transform hover:scale-[1.01] active:scale-[0.99]'
                            }
                        `}
                    >
                        {state === AppState.PROCESSING ? (
                            <Spinner />
                        ) : (
                            <>
                                <ImagePlus className="w-5 h-5" />
                                Generate Edit
                            </>
                        )}
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === AppState.COMPLETE && (
          <div className="animate-fade-in">
            <ResultViewer 
                originalImageSrc={originalImagePreview} 
                processedImageSrc={resultImage} 
                onReset={handleReset} 
            />
          </div>
        )}

      </main>
      
      <footer className="w-full py-6 border-t border-dark-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-dark-muted text-sm">
            <p>© {new Date().getFullYear()} Nano Banana AI Editor. Built with Gemini 2.5 Flash Image.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
