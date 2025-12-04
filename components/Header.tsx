import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 border-b border-dark-border bg-dark-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2 rounded-lg shadow-lg shadow-brand-500/20">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Nano Banana <span className="text-brand-500">Editor</span></h1>
            <p className="text-xs text-dark-muted">Powered by Gemini 2.5 Flash Image</p>
          </div>
        </div>
        <a 
            href="#" 
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-border hover:bg-dark-bg transition-colors text-xs font-medium text-dark-muted hover:text-white"
        >
            <Sparkles className="w-3 h-3" />
            <span>AI Powered</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
