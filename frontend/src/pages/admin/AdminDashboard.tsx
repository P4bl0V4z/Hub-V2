
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BeLoopIcon from "@/components/BeLoopIcons";
import { useNavigate } from "react-router-dom";
import AdminOverviewChart from "@/components/admin/AdminOverviewChart";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";
import AdminClientStats from "@/components/admin/AdminClientStats";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard de Administración</h2>
          <p className="text-muted-foreground">
            Monitoreo general de la plataforma BeLoop y sus usuarios
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Tabs defaultValue="7d" className="w-[220px]" onValueChange={setTimeRange}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => navigate("/admin/reports")}>
            <BeLoopIcon name="download" className="mr-2" size={16} />
            Exportar
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">152</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <BeLoopIcon name="trendingUp" size={16} className="mr-1" />
              <span>+12% vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,843</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <BeLoopIcon name="trendingUp" size={16} className="mr-1" />
              <span>+5.2% vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nivel de Cumplimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <BeLoopIcon name="trendingUp" size={16} className="mr-1" />
              <span>+2.3% vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Abiertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="flex items-center text-sm text-red-500 mt-1">
              <BeLoopIcon name="trendingDown" size={16} className="mr-1" />
              <span>-12% vs. semana anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle>Actividad de la Plataforma</CardTitle>
              <CardDescription>
                Visitas, inicios de sesión y transacciones en el período seleccionado
              </CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <BeLoopIcon name="moreHorizontal" size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <AdminOverviewChart timeRange={timeRange} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle>Clientes por Industria</CardTitle>
              <CardDescription>
                Distribución de clientes por sector industrial
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <BeLoopIcon name="moreHorizontal" size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <AdminClientStats />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones realizadas en la plataforma
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <BeLoopIcon name="externalLink" size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <AdminRecentActivity />
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <Button variant="ghost" className="w-full" onClick={() => navigate("/admin/activity")}>
              Ver todas las actividades
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
