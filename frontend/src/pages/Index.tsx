import { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';
import KpiCard from '@/components/KpiCard';
import WorldMap from '@/components/WorldMap';
import CriticalDates from '@/components/CriticalDates';
import WorkflowStatus from '@/components/WorkflowStatus';
import WelcomeCard from '@/components/WelcomeCard';
import DiagnosticCard from '@/components/DiagnosticCard';
import MilestonesMap from '@/components/MilestonesMap';
import { Package, FileCheck, Scale } from 'lucide-react';
import { useAuth } from "@/components/auth/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const userName = user?.name || user?.email || 'usuario';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WelcomeCard userName={userName} implementationPercentage={65} />
            <DiagnosticCard />
          </div>
          {/* ... resto igual */}
        </div>
      </div>
    </div>
  );
};
export default Index;
