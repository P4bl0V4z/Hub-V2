
import React from 'react';
import { ContextHelp } from '@/components/ContextualHelp';

interface ModulesHeaderProps {
  title: string;
  description: string;
}

const ModulesHeader: React.FC<ModulesHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-1 flex items-center">
          {title}
          <ContextHelp 
            id="modules-overview"
            content="Los módulos son funcionalidades especializadas del sistema para diferentes aspectos de la economía circular"
            useHoverCard={true}
            size={18}
            title="Módulos del Sistema"
          />
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default ModulesHeader;
