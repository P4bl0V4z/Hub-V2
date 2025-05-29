import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Line } from "@/components/ui/chart";
import { 
  Download, Calendar, Filter, BarChart2, PieChart, LineChart, 
  Printer, Info, ClipboardList, FileSpreadsheet, FileCheck,
  FileText, FileStack, ArrowUpRight, Eye
} from 'lucide-react';
import * as RechartsPrimitive from "recharts";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { escapeJSX } from '@/utils/stringUtils';
import MaterialFlowChart from "@/components/reports/MaterialFlowChart";
import WasteDistributionChart from "@/components/reports/WasteDistributionChart";
import CircularityChart from "@/components/reports/CircularityChart";
import EmissionsByStageChart from "@/components/reports/EmissionsByStageChart";
import ChartWrapper from "@/components/ChartWrapper";
import { Chart, Bar, Pie } from "@/components/ui/chart";

const Reports = () => {
  // State for filters
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("pdf");

  // Enhanced monthly data with more context and better distribution
  const monthlyData = [
    { name: 'Ene', value: 1200, percentage: 48, goal: 1300, previous: 950 },
    { name: 'Feb', value: 1350, percentage: 54, goal: 1350, previous: 1050 },
    { name: 'Mar', value: 1250, percentage: 50, goal: 1400, previous: 1100 },
    { name: 'Abr', value: 1420, percentage: 57, goal: 1450, previous: 1150 },
    { name: 'May', value: 1550, percentage: 62, goal: 1500, previous: 1200 },
    { name: 'Jun', value: 1680, percentage: 67, goal: 1550, previous: 1250 },
    { name: 'Jul', value: 1790, percentage: 72, goal: 1600, previous: 1300 },
    { name: 'Ago', value: 1860, percentage: 74, goal: 1650, previous: 1350 },
    { name: 'Sep', value: 1950, percentage: 78, goal: 1700, previous: 1400 },
    { name: 'Oct', value: 2100, percentage: 84, goal: 1800, previous: 1450 },
    { name: 'Nov', value: 2300, percentage: 92, goal: 1900, previous: 1500 },
    { name: 'Dic', value: 2453, percentage: 98, goal: 2000, previous: 1550 }
  ];

  // Enhanced circularity data with additional metrics and trends
  const circularityData = [
    { name: 'Material Reciclado', value: 45, fill: '#9b87f5', trend: '+8%', submetrics: [
      { name: 'Post-consumo', value: 32 },
      { name: 'Pre-consumo', value: 13 }
    ]},
    { name: 'Material Recuperable', value: 35, fill: '#0EA5E9', trend: '+5%', submetrics: [
      { name: 'Compostable', value: 15 },
      { name: 'Reutilizable', value: 20 }
    ]},
    { name: 'No Recuperable', value: 20, fill: '#F97316', trend: '-3%', submetrics: [
      { name: 'No reciclable', value: 12 },
      { name: 'Contaminado', value: 8 }
    ]}
  ];

  // Enhanced compliance data with additional context and better spacing
  const complianceData = [
    { name: 'Ene', cumplimiento: 65, meta: 70, regulacion: 60, tasa_valorizacion: 55, recoleccion: 58 },
    { name: 'Feb', cumplimiento: 68, meta: 70, regulacion: 60, tasa_valorizacion: 58, recoleccion: 60 },
    { name: 'Mar', cumplimiento: 72, meta: 70, regulacion: 65, tasa_valorizacion: 63, recoleccion: 65 },
    { name: 'Abr', cumplimiento: 75, meta: 80, regulacion: 65, tasa_valorizacion: 66, recoleccion: 68 },
    { name: 'May', cumplimiento: 79, meta: 80, regulacion: 70, tasa_valorizacion: 70, recoleccion: 72 },
    { name: 'Jun', cumplimiento: 82, meta: 80, regulacion: 70, tasa_valorizacion: 73, recoleccion: 75 },
    { name: 'Jul', cumplimiento: 85, meta: 85, regulacion: 75, tasa_valorizacion: 76, recoleccion: 79 },
    { name: 'Ago', cumplimiento: 87, meta: 85, regulacion: 75, tasa_valorizacion: 79, recoleccion: 82 },
    { name: 'Sep', cumplimiento: 90, meta: 85, regulacion: 80, tasa_valorizacion: 82, recoleccion: 85 },
    { name: 'Oct', cumplimiento: 92, meta: 90, regulacion: 80, tasa_valorizacion: 85, recoleccion: 87 },
    { name: 'Nov', cumplimiento: 94, meta: 90, regulacion: 85, tasa_valorizacion: 88, recoleccion: 90 },
    { name: 'Dic', cumplimiento: 95, meta: 90, regulacion: 85, tasa_valorizacion: 90, recoleccion: 92 }
  ];

  // New traceability data with cleaner distribution
  const traceabilityData = [
    { name: 'Ene', productosTrazados: 420, productosTotal: 520, cobertura: 81 },
    { name: 'Feb', productosTrazados: 455, productosTotal: 540, cobertura: 84 },
    { name: 'Mar', productosTrazados: 480, productosTotal: 550, cobertura: 87 },
    { name: 'Abr', productosTrazados: 510, productosTotal: 570, cobertura: 89 },
    { name: 'May', productosTrazados: 530, productosTotal: 580, cobertura: 91 },
    { name: 'Jun', productosTrazados: 550, productosTotal: 590, cobertura: 93 },
    { name: 'Jul', productosTrazados: 565, productosTotal: 600, cobertura: 94 },
    { name: 'Ago', productosTrazados: 580, productosTotal: 610, cobertura: 95 },
    { name: 'Sep', productosTrazados: 590, productosTotal: 615, cobertura: 96 },
    { name: 'Oct', productosTrazados: 600, productosTotal: 620, cobertura: 97 },
    { name: 'Nov', productosTrazados: 610, productosTotal: 625, cobertura: 98 },
    { name: 'Dic', productosTrazados: 620, productosTotal: 630, cobertura: 98 }
  ];
  
  // Materials data for circular economy with better visualization
  const materialBreakdownData = [
    { name: 'PET', percentage: 35, recycled: 92, recovered: 96, isRecyclable: true, recyclability: "Alta" },
    { name: 'HDPE', percentage: 22, recycled: 86, recovered: 90, isRecyclable: true, recyclability: "Alta" },
    { name: 'PVC', percentage: 10, recycled: 45, recovered: 50, isRecyclable: true, recyclability: "Media" },
    { name: 'LDPE', percentage: 15, recycled: 60, recovered: 65, isRecyclable: true, recyclability: "Media" },
    { name: 'PP', percentage: 8, recycled: 75, recovered: 80, isRecyclable: true, recyclability: "Alta" },
    { name: 'PS', percentage: 5, recycled: 30, recovered: 35, isRecyclable: true, recyclability: "Baja" },
    { name: 'Otros', percentage: 5, recycled: 15, recovered: 20, isRecyclable: false, recyclability: "Muy baja" }
  ];
  
  // New circular economy data with improved color scheme
  const circularEconomyData = [
    { name: 'Ene', indice: 56, meta: 60, reciclabilidad: 68, reutilizacion: 45, composicion_sostenible: 55 },
    { name: 'Feb', indice: 58, meta: 60, reciclabilidad: 70, reutilizacion: 46, composicion_sostenible: 57 },
    { name: 'Mar', indice: 62, meta: 65, reciclabilidad: 72, reutilizacion: 50, composicion_sostenible: 63 },
    { name: 'Abr', indice: 65, meta: 65, reciclabilidad: 75, reutilizacion: 52, composicion_sostenible: 65 },
    { name: 'May', indice: 68, meta: 70, reciclabilidad: 77, reutilizacion: 55, composicion_sostenible: 67 },
    { name: 'Jun', indice: 71, meta: 70, reciclabilidad: 80, reutilizacion: 58, composicion_sostenible: 70 },
    { name: 'Jul', indice: 73, meta: 75, reciclabilidad: 82, reutilizacion: 60, composicion_sostenible: 73 },
    { name: 'Ago', indice: 76, meta: 75, reciclabilidad: 84, reutilizacion: 62, composicion_sostenible: 76 },
    { name: 'Sep', indice: 78, meta: 80, reciclabilidad: 86, reutilizacion: 65, composicion_sostenible: 78 },
    { name: 'Oct', indice: 82, meta: 80, reciclabilidad: 88, reutilizacion: 68, composicion_sostenible: 82 },
    { name: 'Nov', indice: 85, meta: 85, reciclabilidad: 90, reutilizacion: 72, composicion_sostenible: 85 },
    { name: 'Dic', indice: 88, meta: 85, reciclabilidad: 92, reutilizacion: 75, composicion_sostenible: 88 }
  ];

  // Extended lifecycle assessment data with better colors
  const lifecycleData = [
    { stage: 'Extracción de materias primas', impact: 28, unit: 'kg CO2 eq', percentage: 28, fill: '#D946EF' },
    { stage: 'Procesamiento y manufactura', impact: 35, unit: 'kg CO2 eq', percentage: 35, fill: '#8B5CF6' },
    { stage: 'Distribución', impact: 12, unit: 'kg CO2 eq', percentage: 12, fill: '#0EA5E9' },
    { stage: 'Uso', impact: 5, unit: 'kg CO2 eq', percentage: 5, fill: '#E5DEFF' },
    { stage: 'Fin de vida', impact: 20, unit: 'kg CO2 eq', percentage: 20, fill: '#F97316' },
  ];

  // New data for the empty chart (previously missing)
  const materialFlowData = [
    { name: 'Materia Prima', value: 100, fill: '#D946EF' },
    { name: 'Procesamiento', value: 95, fill: '#8B5CF6' },
    { name: 'Manufactura', value: 90, fill: '#9b87f5' },
    { name: 'Distribución', value: 88, fill: '#0EA5E9' },
    { name: 'Consumo', value: 85, fill: '#F2FCE2' },
    { name: 'Reciclaje', value: 45, fill: '#22c55e' },
  ];

  const wasteDistributionData = [
    { name: 'Reciclado', value: 45, fill: '#22c55e' },
    { name: 'Incinerado', value: 20, fill: '#F97316' },
    { name: 'Vertedero', value: 20, fill: '#ef4444' },
    { name: 'Reutilizado', value: 15, fill: '#0EA5E9' },
  ];

  // Expanded report list with more details
  const reportList = [
    { 
      id: 1, 
      name: "Reporte Trimestral Q1 2025", 
      type: "Compliance", 
      date: "31/03/2025",
      status: "Completado",
      size: "2.4MB",
      author: "Carlos Mendoza",
      downloads: 12
    },
    { 
      id: 2, 
      name: "Huella de Carbono 2024", 
      type: "Sostenibilidad", 
      date: "15/02/2025",
      status: "Completado",
      size: "3.8MB",
      author: "María Fernanda",
      downloads: 24
    },
    { 
      id: 3, 
      name: "Análisis de Circularidad", 
      type: "Análisis", 
      date: "05/04/2025",
      status: "En Proceso",
      size: "1.9MB",
      author: "Juan Pérez",
      downloads: 8
    },
    { 
      id: 4, 
      name: "Trazabilidad por Producto", 
      type: "Operacional", 
      date: "10/04/2025",
      status: "Pendiente",
      size: "3.2MB",
      author: "Andrea López",
      downloads: 0
    },
    { 
      id: 5, 
      name: "Reporte de Proveedores", 
      type: "Cadena de Suministro", 
      date: "22/03/2025",
      status: "Completado",
      size: "4.1MB",
      author: "Rodrigo Silva",
      downloads: 15
    },
    { 
      id: 6, 
      name: "Índice de Economía Circular Q1", 
      type: "Economía Circular", 
      date: "02/04/2025",
      status: "Completado",
      size: "2.7MB",
      author: "Carolina Torres",
      downloads: 18
    },
    { 
      id: 7, 
      name: "Declaración REP Mensual", 
      type: "Normativo", 
      date: "15/04/2025",
      status: "Pendiente",
      size: "1.5MB",
      author: "Francisco Mora",
      downloads: 0
    }
  ];

  // Export formats
  const exportFormats = [
    { id: "pdf", name: "PDF" },
    { id: "excel", name: "Excel" },
    { id: "csv", name: "CSV" },
    { id: "json", name: "JSON" },
  ];

  // REP Compliance KPIs
  const repKpis = [
    { name: "Cumplimiento global", value: "95%", change: "+5%", status: "positive" },
    { name: "Tasa de valorización", value: "90%", change: "+8%", status: "positive" },
    { name: "Tasa de recolección", value: "92%", change: "+7%", status: "positive" },
    { name: "Reportes en tiempo", value: "100%", change: "+0%", status: "neutral" },
  ];

  // Circular Economy KPIs
  const circularKpis = [
    { name: "Índice de circularidad", value: "88%", change: "+12%", status: "positive" },
    { name: "Reciclabilidad promedio", value: "92%", change: "+15%", status: "positive" },
    { name: "Reutilización", value: "75%", change: "+22%", status: "positive" },
    { name: "Composición sostenible", value: "88%", change: "+18%", status: "positive" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Informes</h1>
            <p className="text-muted-foreground">Visualización y análisis de datos de trazabilidad y ciclo de vida</p>
          </div>
          <Badge className="bg-green-600 text-white hover:bg-green-700">
            Actualizado: 05/05/2025
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            <Select defaultValue={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el año</SelectItem>
                <SelectItem value="q1">Q1 (Ene-Mar)</SelectItem>
                <SelectItem value="q2">Q2 (Abr-Jun)</SelectItem>
                <SelectItem value="q3">Q3 (Jul-Sep)</SelectItem>
                <SelectItem value="q4">Q4 (Oct-Dic)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Select defaultValue={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format.id} value={format.id}>
                    {format.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="dashboard">
              <BarChart2 className="mr-1 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="trazabilidad">
              <LineChart className="mr-1 h-4 w-4" />
              Trazabilidad
            </TabsTrigger>
            <TabsTrigger value="cumplimiento">
              <ClipboardList className="mr-1 h-4 w-4" />
              Cumplimiento REP
            </TabsTrigger>
            <TabsTrigger value="economia-circular">
              <PieChart className="mr-1 h-4 w-4" />
              Economía Circular
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Productos Trazados
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Evolución mensual de productos trazados durante 2025. Visualización del progreso de implementación del sistema.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Evolución mensual 2025</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64">
                    <ChartWrapper data={monthlyData}>
                      <Line>
                        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
                        <RechartsPrimitive.XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 10 }}
                          tickLine={{ stroke: '#9b87f5' }}
                          axisLine={{ stroke: '#E5DEFF' }}
                        />
                        <RechartsPrimitive.YAxis 
                          tick={{ fontSize: 10 }}
                          tickLine={{ stroke: '#9b87f5' }}
                          axisLine={{ stroke: '#E5DEFF' }}
                        />
                        <RechartsPrimitive.Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border rounded-md shadow-md">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p className="text-sm">{`Productos: ${payload[0].value}`}</p>
                                  <p className="text-sm">{`Meta: ${payload[0].payload.goal}`}</p>
                                  <p className="text-sm">{`2024: ${payload[0].payload.previous}`}</p>
                                  <p className="text-sm text-green-600">{`${payload[0].payload.percentage}% del objetivo anual`}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <RechartsPrimitive.Line 
                          type="monotone" 
                          dataKey="value" 
                          data={monthlyData} 
                          stroke="#9b87f5" 
                          strokeWidth={2}
                          dot={{ fill: '#9b87f5', r: 3 }}
                          activeDot={{ r: 5 }}
                          name="2025"
                        />
                        <RechartsPrimitive.Line 
                          type="monotone" 
                          dataKey="previous" 
                          data={monthlyData} 
                          stroke="#7E69AB" 
                          strokeDasharray="5 5"
                          strokeWidth={1.5}
                          dot={{ fill: '#7E69AB', r: 2 }}
                          name="2024"
                        />
                        <RechartsPrimitive.Line 
                          type="monotone" 
                          dataKey="goal" 
                          data={monthlyData} 
                          stroke="#22c55e"
                          strokeWidth={1.5}
                          strokeDasharray="5 5"
                          dot={{ fill: '#22c55e', r: 2 }}
                          name="Meta"
                        />
                        <RechartsPrimitive.Area
                          type="monotone"
                          dataKey="value"
                          data={monthlyData}
                          stroke="#9b87f5"
                          fill="#E5DEFF"
                          fillOpacity={0.3}
                        />
                        <RechartsPrimitive.Legend 
                          verticalAlign="top" 
                          height={36}
                          iconSize={10}
                          iconType="circle"
                        />
                      </Line>
                    </ChartWrapper>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground border-t pt-3">
                  <div className="flex justify-between w-full">
                    <div>Meta anual: 2,500 productos</div>
                    <div className="font-medium text-green-600">98% completado</div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Índice de Economía Circular
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Distribución de materiales según su capacidad de reciclaje y recuperación en la cadena productiva.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Distribución de materiales</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <CircularityChart />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground border-t pt-3">
                  <div className="flex justify-between w-full">
                    <div>Total de materiales analizados: 18</div>
                    <div className="font-medium text-green-600">+10% vs 2024</div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Cumplimiento REP
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Comparativa del nivel de cumplimiento actual con las metas internas y los requisitos regulatorios mínimos.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Comparativa con metas regulatorias</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64">
                    <ChartWrapper data={complianceData}>
                      <Bar>
                        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
                        <RechartsPrimitive.XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 10 }}
                          tickLine={{ stroke: '#9b87f5' }}
                          axisLine={{ stroke: '#E5DEFF' }}
                          interval={1} // Mostrar solo etiquetas alternas para evitar solapamiento
                        />
                        <RechartsPrimitive.YAxis 
                          tick={{ fontSize: 10 }}
                          tickLine={{ stroke: '#9b87f5' }}
                          axisLine={{ stroke: '#E5DEFF' }}
                        />
                        <RechartsPrimitive.Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 border rounded-md shadow-md">
                                  <p className="font-medium">{data.name}</p>
                                  <div className="flex gap-2 items-center mt-1">
                                    <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                                    <p className="text-sm">{`Cumplimiento: ${data.cumplimiento}%`}</p>
                                  </div>
                                  <div className="flex gap-2 items-center mt-1">
                                    <div className="w-3 h-3 rounded-sm bg-indigo-400"></div>
                                    <p className="text-sm">{`Meta interna: ${data.meta}%`}</p>
                                  </div>
                                  <div className="flex gap-2 items-center mt-1">
                                    <div className="w-3 h-3 rounded-sm bg-orange-300"></div>
                                    <p className="text-sm">{`Mínimo regulatorio: ${data.regulacion}%`}</p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <RechartsPrimitive.Legend 
                          verticalAlign="top" 
                          height={36}
                          iconSize={8}
                          iconType="square"
                          wrapperStyle={{ fontSize: '10px' }}
                        />
                        <RechartsPrimitive.Bar 
                          dataKey="cumplimiento" 
                          name="Cumplimiento REP"
                          barSize={8} // Barra más delgada para evitar solapamiento
                          fill="#22c55e" 
                          radius={[6, 6, 0, 0]} 
                        />
                        <RechartsPrimitive.Bar 
                          dataKey="meta" 
                          name="Meta Interna"
                          barSize={8}
                          fill="#9b87f5" 
                          radius={[6, 6, 0, 0]}
                        />
                        <RechartsPrimitive.Bar 
                          dataKey="regulacion" 
                          name="Mínimo Regulatorio"
                          barSize={8}
                          fill="#F97316" 
                          radius={[6, 6, 0, 0]}
                        />
                      </Bar>
                    </ChartWrapper>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground border-t pt-3">
                  <div className="flex justify-between w-full">
                    <div>Cumplimiento actual: 95%</div>
                    <div className="font-medium text-green-600">+5% sobre meta interna</div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Updated charts that were previously blank */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Flujo de Materiales
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Visualización del flujo de materiales a lo largo de la cadena de valor.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Cadena de valor circular</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <MaterialFlowChart />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground border-t pt-3">
                  <div className="flex justify-between w-full">
                    <div>Pérdida total: 55%</div>
                    <div className="font-medium text-green-600">+5% eficiencia vs 2024</div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Distribución de Residuos
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Distribución actual de residuos por método de tratamiento.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Tratamiento post-consumo</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <WasteDistributionChart />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground border-t pt-3">
                  <div className="flex justify-between w-full">
                    <div>Material recuperado: 60%</div>
                    <div className="font-medium text-green-600">+8% vs 2024</div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Emisiones por Etapa</CardTitle>
                <CardDescription>
                  Análisis de ciclo de vida - Emisiones GEI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <EmissionsByStageChart />
                  </div>
                  <div className="flex items-center">
                    <div className="space-y-4 w-full">
                      <h3 className="text-lg font-medium">Análisis de Impacto</h3>
                      <p className="text-sm text-muted-foreground">
                        El mayor impacto se concentra en las etapas iniciales de la cadena de valor. 
                        Procesamiento y manufactura representan el 35% de las emisiones totales, 
                        seguido de la extracción de materias primas con un 28%.
                      </p>
                      <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-medium">Oportunidades de mejora:</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Optimización de procesos de manufactura</li>
                          <li>Transición hacia fuentes de energía renovable</li>
                          <li>Utilización de materiales reciclados o de menor impacto</li>
                          <li>Optimización logística en distribución</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informes Recientes</CardTitle>
                <CardDescription>
                  Últimos informes generados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportList.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{escapeJSX(report.name)}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge variant={report.status === "Completado" ? "success" : report.status === "En Proceso" ? "outline" : "secondary"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.author}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
