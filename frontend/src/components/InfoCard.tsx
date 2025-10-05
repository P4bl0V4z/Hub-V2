// src/components/InfoCard.tsx
import React from 'react';
import { Info } from 'lucide-react';

interface InfoCardProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function InfoCard({ isOpen, onToggle, className = '' }: InfoCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-200 ml-2 ${
        isOpen 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
      } ${className}`}
      aria-label={isOpen ? "Ocultar información" : "Mostrar información"}
      type="button"
    >
      <Info size={14} />
    </button>
  );
}