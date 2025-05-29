
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BeLoopIcon from "@/components/BeLoopIcons";
import AdminReportsChart from "@/components/admin/AdminReportsChart";

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reportes y Analíticas</h2>
          <p className="text-muted-foreground">
            Visualice y analice datos de la plataforma
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Tabs defaultValue="monthly" className="w-[280px]" onValueChange={setTimeRange}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="yearly">Anual</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>
            <BeLoopIcon name="download" className="mr-2" size={16} />
            Exportar
          </Button>
        </div>
      </div>

      {/* Panel de reportes rápidos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <BeLoopIcon name="trendingUp" size={16} className="mr-1" />
              <span>+14% vs. período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Documentos Procesados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,432</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <BeLoopIcon name="trendingUp" size={16} className="mr-1" />
              <span>+8.2% vs. período anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68%</div>
            <div className="flex items-center text-sm text-red-500 mt-1">
              <BeLoopIcon name="trendingDown" size={16} className="mr-1" />
              <span>-2.3% vs. período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle>Tendencias de Actividad</CardTitle>
            <CardDescription>
              Actividad de clientes y usuarios en la plataforma
            </CardDescription>
          </div>
          <Button variant="outline" size="icon">
            <BeLoopIcon name="moreHorizontal" size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <AdminReportsChart timeRange={timeRange} />
        </CardContent>
      </Card>

      {/* Reportes predefinidos */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Predefinidos</CardTitle>
          <CardDescription>
            Acceda a reportes comunes y personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Rendimiento por Cliente</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Análisis detallado del rendimiento y actividad por cliente
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <BeLoopIcon name="barChart" size={16} className="mr-2" />
                    Ver Reporte
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Estado de Cumplimiento</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Análisis del estado de cumplimiento normativo por cliente
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <BeLoopIcon name="fileCheck" size={16} className="mr-2" />
                    Ver Reporte
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Actividad de Usuarios</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Análisis de la actividad de usuarios en la plataforma
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <BeLoopIcon name="users" size={16} className="mr-2" />
                    Ver Reporte
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Tickets de Soporte</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Análisis de tickets de soporte y tiempo de respuesta
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <BeLoopIcon name="ticket" size={16} className="mr-2" />
                    Ver Reporte
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t px-6 py-4">
          <Button>
            <BeLoopIcon name="plus" className="mr-2" size={16} />
            Crear Reporte Personalizado
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminReports;
