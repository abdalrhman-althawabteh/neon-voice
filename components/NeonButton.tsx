import React from 'react';

interface NeonButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  onClick, 
  disabled = false, 
  active = false, 
  children,
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group overflow-hidden transition-all duration-300 ease-out
        border border-yellow-500/50 rounded-full
        flex items-center justify-center
        ${active 
          ? 'bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.4)] border-yellow-400' 
          : 'bg-black hover:bg-yellow-950/20 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className={`
        absolute inset-0 bg-yellow-400/20 blur-xl rounded-full transition-opacity duration-300
        ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}
      `} />
      
      <span className="relative z-10 text-yellow-400 font-semibold tracking-wider flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};
