import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, ArrowRight, FileText, Download, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { exportToExcel, formatMaterialsForExport } from "@/utils/excelExport";

// Standard PemCardProps for individual KPI cards
interface PemCardProps {
  title: string;
  description: string;
  value: string;
  change: string;
  status: 'positive' | 'negative' | 'neutral';
}

// Interface for materials in the REP module
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

// Create a new interface that extends PemCardProps and adds the materials property
interface PemCardWithMaterialsProps {
  materials: RepMaterial[];
}

// Main PemCard Component with conditional rendering based on props
const PemCard = (props: PemCardProps | PemCardWithMaterialsProps) => {
  // Check if it's the materials variant
  if ('materials' in props) {
    return renderMaterialsTable(props.materials);
  }
  
  // Otherwise render the standard KPI card
  return renderStandardCard(props);
};

// Helper function to render the standard KPI card
const renderStandardCard = ({ title, description, value, change, status }: PemCardProps) => {
  let arrowIcon;
  let textColorClass;
  let badgeColorClass;

  switch (status) {
    case 'positive':
      arrowIcon = <ArrowUp className="h-4 w-4 text-green-500" />;
      textColorClass = "text-green-500";
      badgeColorClass = "bg-green-100 text-green-700";
      break;
    case 'negative':
      arrowIcon = <ArrowDown className="h-4 w-4 text-red-500" />;
      textColorClass = "text-red-500";
      badgeColorClass = "bg-red-100 text-red-700";
      break;
    case 'neutral':
    default:
      arrowIcon = <ArrowRight className="h-4 w-4 text-gray-500" />;
      textColorClass = "text-gray-500";
      badgeColorClass = "bg-gray-100 text-gray-700";
      break;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Badge className={badgeColorClass}>
            <div className="flex items-center">
              {arrowIcon}
              <span className="ml-1">{change}</span>
            </div>
          </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
        </div>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

// Get risk level color
const getRiskLevelColor = (level?: 'high' | 'medium' | 'low') => {
  if (!level) return "bg-gray-100 text-gray-700";
  
  switch (level) {
    case 'high':
      return "bg-red-100 text-red-700";
    case 'medium':
      return "bg-amber-100 text-amber-700";
    case 'low':
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Helper function to render the materials table
const renderMaterialsTable = (materials: RepMaterial[]) => {
  // For calculating totals
  const totalYearToDate = materials.reduce((sum, material) => sum + material.yearToDate, 0);
  const totalTarget = materials.reduce((sum, material) => sum + material.target, 0);
  const overallProgressPercentage = Math.round((totalYearToDate / totalTarget) * 100);
  
  // Identify materials at risk
  const materialsAtRisk = materials.filter(m => 
    m.risks?.supply === 'high' || 
    m.risks?.compliance === 'high' || 
    m.risks?.cost === 'high' || 
    (m.yearToDate / m.target) < 0.5
  );

  // Handle export to Excel
  const handleExportMaterials = () => {
    const formattedData = formatMaterialsForExport(materials);
    exportToExcel(
      formattedData,
      'Materiales_REP',
      'Materiales Reportados',
      { 'Material': 20, 'Clasificación': 30, 'Origen': 15 }
    );
    toast.success("Datos de materiales exportados correctamente");
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Materiales Reportados</CardTitle>
          <CardDescription>
            Seguimiento de materiales reportados, metas y tendencias
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleExportMaterials}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Generar Informe
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Progreso total</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{overallProgressPercentage}%</div>
                <Progress value={overallProgressPercentage} className="h-2 w-1/2" />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {totalYearToDate} / {totalTarget} unidades reportadas
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Materiales registrados</div>
              <div className="text-2xl font-bold">{materials.length}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Actualizado al {new Date().toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Materiales en riesgo</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold">{materialsAtRisk.length}</div>
                {materialsAtRisk.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <AlertTriangle className="h-4 w-4 ml-2 text-amber-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Materiales con riesgo alto o progreso insuficiente</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Requieren atención prioritaria
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Table */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Acumulado</TableHead>
                <TableHead>Meta Anual</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Tendencia</TableHead>
                <TableHead>Riesgos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => {
                const progressPercentage = Math.round((material.yearToDate / material.target) * 100);
                const isTrendPositive = material.trend.includes('+');
                
                return (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.quantity} {material.unit}</TableCell>
                    <TableCell>{material.yearToDate} {material.unit}</TableCell>
                    <TableCell>{material.target} {material.unit}</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={progressPercentage} 
                          className="h-2" 
                          indicatorClassName={progressPercentage < 50 ? "bg-amber-500" : "bg-green-500"}
                        />
                        <span className="text-sm w-12">{progressPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={isTrendPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        <div className="flex items-center">
                          {isTrendPositive 
                            ? <ArrowUp className="h-3 w-3 mr-1" />
                            : <ArrowDown className="h-3 w-3 mr-1" />
                          }
                          {material.trend}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {material.risks?.supply && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={getRiskLevelColor(material.risks.supply)}>S</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Riesgo de Suministro: {material.risks.supply}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {material.risks?.compliance && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={getRiskLevelColor(material.risks.compliance)}>C</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Riesgo de Cumplimiento: {material.risks.compliance}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {material.risks?.cost && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={getRiskLevelColor(material.risks.cost)}>$</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Riesgo de Costo: {material.risks.cost}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-between items-center text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
          <div>Visualizando {materials.length} de {materials.length} materiales reportados</div>
          <div className="flex items-center">
            <span className="mr-2">Leyenda:</span>
            <span className="flex items-center mr-2"><Badge className="bg-green-100 text-green-700 mr-1">S</Badge> Suministro</span>
            <span className="flex items-center mr-2"><Badge className="bg-blue-100 text-blue-700 mr-1">C</Badge> Cumplimiento</span>
            <span className="flex items-center"><Badge className="bg-amber-100 text-amber-700 mr-1">$</Badge> Costo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PemCard;
