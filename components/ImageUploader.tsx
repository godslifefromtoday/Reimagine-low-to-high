import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelected(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`
        w-full h-96 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-brand-500 bg-brand-500/10 scale-[1.01]' 
          : 'border-dark-border bg-dark-card hover:border-brand-500/50 hover:bg-dark-card/80'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleFileInput} 
        className="hidden" 
        accept="image/*"
      />
      
      <div className={`
        w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors
        ${isDragging ? 'bg-brand-500 text-white' : 'bg-dark-bg text-dark-muted group-hover:text-brand-400'}
      `}>
        {isDragging ? <Upload className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">Upload an Image</h3>
      <p className="text-dark-muted text-sm text-center max-w-xs">
        Drag and drop your image here, or click to browse files.
        <br/><span className="text-xs opacity-60">Supports JPG, PNG, WEBP</span>
      </p>
    </div>
  );
};

export default ImageUploader;
