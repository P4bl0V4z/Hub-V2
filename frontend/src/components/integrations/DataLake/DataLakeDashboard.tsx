
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Clock, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ChartWrapper from '@/components/ChartWrapper';
import { Line, Bar, Pie } from "@/components/ui/chart";
import HelpTooltip from '@/components/HelpTooltip';

const DataLakeDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");

  // Sample data for charts
  const dataFlowData = [
    { date: "2025-04-05", value: 4200 },
    { date: "2025-04-06", value: 4300 },
    { date: "2025-04-07", value: 4100 },
    { date: "2025-04-08", value: 4700 },
    { date: "2025-04-09", value: 4900 },
    { date: "2025-04-10", value: 5100 },
    { date: "2025-04-11", value: 5400 },
  ];

  const dataQualityData = [
    { name: "Completos", value: 72 },
    { name: "Parciales", value: 21 },
    { name: "Incompletos", value: 7 },
  ];

  const sourceTypeData = [
    { name: "Sensores IoT", value: 28 },
    { name: "ERP", value: 15 },
    { name: "Archivos CSV", value: 9 },
    { name: "API Externas", value: 4 },
  ];

  // Recent activity data
  const recentActivity = [
    {
      timestamp: "2025-05-05 09:23",
      event: "Sincronización completada",
      source: "SAP ERP",
      status: "success"
    },
    {
      timestamp: "2025-05-05 07:15",
      event: "Nueva fuente añadida",
      source: "Sensor IoT #125",
      status: "success"
    },
    {
      timestamp: "2025-05-04 23:00",
      event: "Sincronización programada",
      source: "Todos los orígenes",
      status: "pending"
    },
    {
      timestamp: "2025-05-04 18:45",
      event: "Error de validación",
      source: "API Proveedores",
      status: "error"
    },
    {
      timestamp: "2025-05-04 14:30",
      event: "Mapeo actualizado",
      source: "Sistema de producción",
      status: "success"
    }
  ];

  // Connection health data
  const connectionHealth = [
    { name: "Activas", value: 48, color: "bg-green-500" },
    { name: "Con advertencias", value: 6, color: "bg-amber-500" },
    { name: "Con errores", value: 2, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Panel de Control de Datos</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período de tiempo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
            <SelectItem value="12m">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Data Flow Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Flujo de datos en tiempo real</span>
              <HelpTooltip content="Volumen de datos procesados en la última semana" />
            </CardTitle>
            <CardDescription>Registros procesados por día (en miles)</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ChartWrapper data={dataFlowData} color="#6366f1">
              <Line
                data={dataFlowData}
                valueFormatter={(value) => `${value.toLocaleString()}`}
                curveType="natural"
              />
            </ChartWrapper>
          </CardContent>
        </Card>

        {/* Connection Health Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Salud de Conexiones</span>
              <HelpTooltip content="Estado actual de las conexiones a fuentes de datos" />
            </CardTitle>
            <CardDescription>Estado de todas las conexiones activas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectionHealth.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${item.color} mr-2`}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex h-4 w-full overflow-hidden rounded-full">
                <div className="bg-green-500 flex-1" style={{ width: `${connectionHealth[0].value / 56 * 100}%` }}></div>
                <div className="bg-amber-500 flex-1" style={{ width: `${connectionHealth[1].value / 56 * 100}%` }}></div>
                <div className="bg-red-500 flex-1" style={{ width: `${connectionHealth[2].value / 56 * 100}%` }}></div>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">56 conexiones en total</p>
            </div>
          </CardContent>
        </Card>

        {/* Data Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Calidad de Datos</span>
              <HelpTooltip content="Distribución de calidad en los datos procesados" />
            </CardTitle>
            <CardDescription>Distribución por completitud de registros</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            <ChartWrapper data={dataQualityData} color="#10b981">
              <Pie
                data={dataQualityData}
                valueFormatter={(value) => `${value}%`}
                colors={["#10b981", "#f59e0b", "#ef4444"]}
              />
            </ChartWrapper>
          </CardContent>
        </Card>

        {/* Source Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tipos de Fuentes</span>
              <HelpTooltip content="Distribución de fuentes de datos por tipo" />
            </CardTitle>
            <CardDescription>Distribución por tipo de origen</CardDescription>
          </CardHeader>
          <CardContent className="h-60">
            <ChartWrapper data={sourceTypeData} color="#6366f1">
              <Bar 
                data={sourceTypeData}
                colors={["#6366f1"]}
                valueFormatter={(value) => `${value}`}
              />
            </ChartWrapper>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas actividades registradas en la integración con DataLake
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center border-b pb-3 last:border-0">
                  <div className="mr-4">
                    {activity.status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {activity.status === "error" && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {activity.status === "pending" && (
                      <Clock className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium">{activity.event}</p>
                      <Badge variant="outline" className="ml-2">{activity.source}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataLakeDashboard;
