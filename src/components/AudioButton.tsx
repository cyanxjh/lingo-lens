import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { playSpeech, stopSpeech } from '../utils/speech';

interface AudioButtonProps {
  text: string;
  bcp47: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  label?: string;
  slow?: boolean;
  className?: string;
  id?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  bcp47,
  size = 'md',
  variant = 'secondary',
  label,
  slow = false,
  className = '',
  id,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setHasError(false);
    setIsPlaying(true);

    const success = playSpeech(text, bcp47, {
      rate: slow ? 0.75 : 0.95,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => {
        setIsPlaying(false);
        setHasError(true);
        setTimeout(() => setHasError(false), 2000);
      },
    });

    if (!success) {
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs gap-1',
    md: 'p-2 text-sm gap-1.5',
    lg: 'px-3 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  const variantClasses = {
    primary:
      'bg-[#1DB954] hover:bg-[#1ed760] text-white shadow-sm hover:shadow active:scale-95',
    secondary:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200/80 active:scale-95',
    ghost:
      'hover:bg-emerald-50/80 text-emerald-800 hover:text-emerald-950 active:scale-95',
  };

  return (
    <button
      id={id || `audio-btn-${encodeURIComponent(text.slice(0, 10))}`}
      type="button"
      onClick={handleClick}
      title={isPlaying ? '停止朗读' : `朗读: ${text}`}
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 cursor-pointer ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${isPlaying ? 'ring-2 ring-[#1DB954] bg-emerald-100/90' : ''} ${className}`}
    >
      {hasError ? (
        <VolumeX size={iconSizes[size]} className="text-red-500 animate-pulse" />
      ) : isPlaying ? (
        <span className="relative flex items-center justify-center">
          <Volume2 size={iconSizes[size]} className="text-[#1DB954] animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ed760] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
          </span>
        </span>
      ) : (
        <Volume2 size={iconSizes[size]} className="opacity-90 group-hover:opacity-100" />
      )}
      {label && <span className="font-medium">{label}</span>}
      {slow && <span className="text-[10px] font-bold uppercase opacity-75">0.7x</span>}
    </button>
  );
};
