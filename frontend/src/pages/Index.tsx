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

const Index = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('beloop_user_name');
    if (name) setUserName(name);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Home</h1>
              <p className="text-muted-foreground">Información general del sistema de Lifecycle Management</p>
            </div>
          </div>
          
          {/* Welcome and Diagnostic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WelcomeCard userName={userName || 'usuario'} implementationPercentage={65} />
            <DiagnosticCard />
          </div>
          
          {/* Milestones Map */}
          <MilestonesMap />
          
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCard 
              title="Total de Productos" 
              value="2,453" 
              description="Productos registrados en el sistema"
              icon={<Package />}
              trend={{ value: 12, isPositive: true }}
            />
            <KpiCard 
              title="Productos afectos a Ley REP" 
              value="1,872" 
              description="76.3% del total de productos"
              icon={<FileCheck />}
              trend={{ value: 5, isPositive: true }}
            />
            <KpiCard 
              title="Toneladas en Mercado (12 Meses)" 
              value="34,728" 
              description="Toneladas de producto puestas en mercado"
              icon={<Scale />}
              trend={{ value: 3, isPositive: false }}
            />
          </div>
          
          {/* Map and Workflows */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <WorldMap />
            </div>
            <div className="space-y-6">
              <CriticalDates />
              <WorkflowStatus />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
