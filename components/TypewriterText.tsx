import React, { useState, useEffect, useRef } from 'react';
import { playTypeSound } from '../utils/soundUtils';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 40, 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastPlayedIndex = useRef(-1);

  useEffect(() => {
    // Reset if text changes completely
    setDisplayedText('');
    setCurrentIndex(0);
    lastPlayedIndex.current = -1;
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Play sound for current char if we haven't played it yet
        if (currentIndex > lastPlayedIndex.current) {
          playTypeSound();
          lastPlayedIndex.current = currentIndex;
        }

      }, speed);

      return () => clearTimeout(timeout);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className="font-sans text-xl md:text-2xl leading-relaxed text-yellow-100/90 font-light tracking-wide">
      {displayedText}
      <span className="animate-pulse text-yellow-400 inline-block ml-1">|</span>
    </div>
  );
};
