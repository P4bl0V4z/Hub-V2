
import React, { useState } from 'react';
import RepModelCard from '@/components/modules/RepModule/RepModelCard';
import BaselineCard from '@/components/modules/RepModule/BaselineCard';
import ReportingCard from '@/components/modules/RepModule/ReportingCard';
import PemCard from '@/components/modules/RepModule/PemCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calculator, FileText, Table2 } from 'lucide-react';

interface RepMaterial {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  yearToDate: number;
  target: number;
  trend: string;
  details?: {
    origin?: string;
    certifications?: string[];
    classification?: string;
    weightPerUnit?: number;
    recyclability?: number; // percentage
  };
  risks?: {
    supply?: 'high' | 'medium' | 'low';
    compliance?: 'high' | 'medium' | 'low';
    cost?: 'high' | 'medium' | 'low';
  };
}

interface RepModuleViewProps {
  materials: RepMaterial[];
}

const RepModuleView: React.FC<RepModuleViewProps> = ({ materials }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Enhanced materials data based on the research requirements
  const enhancedMaterials: RepMaterial[] = materials.map(material => {
    // Add risk assessment based on trend and progress
    const progressPercentage = (material.yearToDate / material.target) * 100;
    const isTrendNegative = material.trend.includes('-');
    
    let supplyRisk: 'high' | 'medium' | 'low' = 'low';
    let complianceRisk: 'high' | 'medium' | 'low' = 'low';
    let costRisk: 'high' | 'medium' | 'low' = 'low';
    
    // Determine risks based on material name, progress, and trend
    if (progressPercentage < 40) {
      supplyRisk = 'high';
    } else if (progressPercentage < 70) {
      supplyRisk = 'medium';
    }
    
    if (isTrendNegative) {
      complianceRisk = 'medium';
      if (material.name.includes('Plástico')) {
        complianceRisk = 'high';
      }
    }
    
    if (material.name.includes('Metales') || material.name.includes('Tetra')) {
      costRisk = 'medium';
    }
    
    // Add more details based on material type
    const details = {
      origin: material.name.includes('Plástico') ? 'Nacional/Importado' : 'Nacional',
      certifications: material.name.includes('Cartón') 
        ? ['FSC', 'ISO 14001'] 
        : material.name.includes('Plástico') 
          ? ['ISCC PLUS'] 
          : [],
      classification: material.name.includes('Plástico') 
        ? 'Prioridad alta (Decreto 12)' 
        : 'Material estándar',
      weightPerUnit: material.quantity / 100, // simplified calculation
      recyclability: material.name.includes('Tetra') 
        ? 35 
        : material.name.includes('Plástico') 
          ? 45 
          : material.name.includes('Metales') 
            ? 70 
            : material.name.includes('Vidrio') 
              ? 90 
              : 75
    };
    
    return {
      ...material,
      details,
      risks: {
        supply: supplyRisk,
        compliance: complianceRisk,
        cost: costRisk
      }
    };
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center">
            <Table2 className="h-4 w-4 mr-2" />
            Materiales
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Reportes
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Simulador
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <RepModelCard />
            <BaselineCard />
            <ReportingCard />
          </div>
          
          <PemCard materials={enhancedMaterials} />
        </TabsContent>
        
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Materiales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-6">
                Este módulo permite realizar la gestión completa de materiales bajo la normativa REP, 
                incluyendo caracterización, trazabilidad, establecimiento de líneas base y reportabilidad.
              </div>
              
              <PemCard materials={enhancedMaterials} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reportabilidad REP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-6">
                Generación automatizada de informes para autoridades reguladoras
                y sistemas colectivos de gestión conforme a la Ley REP 20.920.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <ReportingCard />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Escenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-6">
                Herramienta de simulación que permite modelar diferentes escenarios de costos
                relacionados con la Ley REP, considerando cambios en materiales, estrategias de
                ecodiseño y cumplimiento normativo.
              </div>
              
              <div className="p-12 text-center border rounded-md bg-muted/30">
                <p className="text-lg font-medium mb-2">Módulo en desarrollo</p>
                <p className="text-muted-foreground">
                  El simulador de escenarios está actualmente en fase de implementación.
                  Estará disponible próximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RepModuleView;
