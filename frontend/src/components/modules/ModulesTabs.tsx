
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContextHelp } from '@/components/ContextualHelp';

interface ModulesTabsProps {
  activeTab: string;
}

const ModulesTabs: React.FC<ModulesTabsProps> = ({ activeTab }) => {
  return (
    <TabsList className="mb-6">
      <TabsTrigger value="general" className="flex items-center">
        General
        <ContextHelp 
          id="general-tab" 
          content="Vista general de todos los módulos del sistema" 
          size={14}
        />
      </TabsTrigger>
      <TabsTrigger value="rep" className="flex items-center">
        Módulo REP
        <ContextHelp 
          id="rep-tab" 
          content="Gestión de la Responsabilidad Extendida del Productor" 
          size={14}
        />
      </TabsTrigger>
      <TabsTrigger value="huella" className="flex items-center">
        Módulo Huella
        <ContextHelp 
          id="footprint-tab" 
          content="Análisis de huella ambiental de productos" 
          size={14}
        />
      </TabsTrigger>
      <TabsTrigger value="pasaportes" className="flex items-center">
        Módulo Pasaportes Digitales
        <ContextHelp 
          id="passports-tab" 
          content="Creación y gestión de pasaportes digitales de productos" 
          size={14}
        />
      </TabsTrigger>
    </TabsList>
  );
};

export default ModulesTabs;
