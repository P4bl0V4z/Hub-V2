
import React from 'react';
import ModuleCard from '@/components/modules/ModuleCard';
import PlanManagementCard from '@/components/modules/PlanManagementCard';
import GlobalKPICard from '@/components/modules/GlobalKPICard';
import { FileCheck, Scale, Shield } from "lucide-react";

interface ModuleStatType {
  active: boolean;
  lastUpdate: string;
  productsRegistered?: number;
  passportsCreated?: number;
  productsAnalyzed?: number;
  completeness: number;
  recentActivities: Array<{
    date: string;
    description: string;
  }>;
}

interface GeneralModuleViewProps {
  moduleStats: {
    rep: ModuleStatType;
    huella: ModuleStatType;
    pasaportes: ModuleStatType;
  };
  onTabChange: (tab: string) => void;
}

const GeneralModuleView: React.FC<GeneralModuleViewProps> = ({ moduleStats, onTabChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModuleCard
          title="Módulo REP"
          active={moduleStats.rep.active}
          lastUpdate={moduleStats.rep.lastUpdate}
          statLabel1="Productos registrados"
          statValue1={moduleStats.rep.productsRegistered || 0}
          statLabel2="Completitud de datos"
          statValue2={`${moduleStats.rep.completeness}%`}
          recentActivities={moduleStats.rep.recentActivities}
          icon={<FileCheck className="mr-2 h-4 w-4" />}
          buttonLabel="Gestionar módulo REP"
          onButtonClick={() => onTabChange("rep")}
        />

        <ModuleCard
          title="Módulo Huella"
          active={moduleStats.huella.active}
          lastUpdate={moduleStats.huella.lastUpdate}
          statLabel1="Productos analizados"
          statValue1={moduleStats.huella.productsAnalyzed || 0}
          statLabel2="Completitud de datos"
          statValue2={`${moduleStats.huella.completeness}%`}
          recentActivities={moduleStats.huella.recentActivities}
          icon={<Scale className="mr-2 h-4 w-4" />}
          buttonLabel="Gestionar módulo Huella"
          onButtonClick={() => onTabChange("huella")}
        />

        <ModuleCard
          title="Módulo Pasaportes"
          active={moduleStats.pasaportes.active}
          lastUpdate={moduleStats.pasaportes.lastUpdate}
          statLabel1="Pasaportes creados"
          statValue1={moduleStats.pasaportes.passportsCreated || 0}
          statLabel2="Completitud de datos"
          statValue2={`${moduleStats.pasaportes.completeness}%`}
          recentActivities={moduleStats.pasaportes.recentActivities}
          icon={<Shield className="mr-2 h-4 w-4" />}
          buttonLabel="Gestionar módulo Pasaportes"
          onButtonClick={() => onTabChange("pasaportes")}
        />
      </div>

      <PlanManagementCard />
      <GlobalKPICard />
    </div>
  );
};

export default GeneralModuleView;
