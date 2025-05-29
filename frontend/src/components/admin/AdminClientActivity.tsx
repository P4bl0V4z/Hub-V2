
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BeLoopIcon from "@/components/BeLoopIcons";
import { cn } from "@/lib/utils";

// Datos simulados de actividad
const generateClientActivity = (clientId: number) => {
  return [
    {
      id: 1,
      user: 'María López',
      action: 'Cargó documento',
      resource: 'Informe trimestral Q1.pdf',
      timestamp: '2023-05-04T14:30:00',
      details: 'Documento cargado en la sección de reportes ambientales',
      category: 'document'
    },
    {
      id: 2,
      user: 'Pedro Gómez',
      action: 'Editó información',
      resource: 'Perfil de empresa',
      timestamp: '2023-05-03T10:15:00',
      details: 'Actualización de información de contacto y dirección',
      category: 'edit'
    },
    {
      id: 3,
      user: 'Sistema',
      action: 'Emitió alerta',
      resource: 'Cumplimiento',
      timestamp: '2023-05-02T16:45:00',
      details: 'Alerta de vencimiento de certificación en 30 días',
      category: 'alert'
    },
    {
      id: 4,
      user: 'Ana Martínez',
      action: 'Generó reporte',
      resource: 'Reporte de trazabilidad',
      timestamp: '2023-05-02T11:20:00',
      details: 'Generación de reporte PDF para el período Abril 2023',
      category: 'report'
    },
    {
      id: 5,
      user: 'Roberto Sánchez',
      action: 'Ingresó al sistema',
      resource: 'Login',
      timestamp: '2023-05-01T09:10:00',
      details: 'Inicio de sesión desde dirección IP 192.168.1.154',
      category: 'login'
    },
    {
      id: 6,
      user: 'Carmen Rodríguez',
      action: 'Exportó datos',
      resource: 'Inventario',
      timestamp: '2023-04-30T15:25:00',
      details: 'Exportación de datos en formato Excel',
      category: 'export'
    },
    {
      id: 7,
      user: 'Sistema',
      action: 'Realizó respaldo',
      resource: 'Datos cliente',
      timestamp: '2023-04-30T01:00:00',
      details: 'Respaldo automático programado de datos del cliente',
      category: 'system'
    }
  ];
};

interface AdminClientActivityProps {
  clientId: number;
}

const AdminClientActivity = ({ clientId }: AdminClientActivityProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const activities = generateClientActivity(clientId);
  
  // Filtrar actividades por búsqueda y categoría
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && activity.category === activeTab;
  });

  // Formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Obtener ícono según categoría
  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'document': return 'fileText';
      case 'edit': return 'edit';
      case 'alert': return 'bell';
      case 'report': return 'barChart';
      case 'login': return 'logIn';
      case 'export': return 'download';
      case 'system': return 'settings';
      default: return 'activity';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-xl font-semibold">Registro de Actividad</h3>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Buscar actividad..." 
              className="max-w-xs" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline">
              <BeLoopIcon name="download" className="mr-2" size={16} />
              Exportar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto grid grid-cols-4 md:inline-flex">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="document">Documentos</TabsTrigger>
            <TabsTrigger value="login">Accesos</TabsTrigger>
            <TabsTrigger value="alert">Alertas</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-6">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="mt-1 mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <BeLoopIcon name={getIconForCategory(activity.category)} className="text-foreground" size={18} />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    <span className="font-bold">{activity.user}</span> {activity.action}
                  </p>
                  <span className="text-xs text-muted-foreground">{formatDateTime(activity.timestamp)}</span>
                </div>
                <p className="text-sm">
                  <span className={cn(
                    "font-medium",
                    activity.category === 'alert' ? "text-amber-500" : ""
                  )}>
                    {activity.resource}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.details}</p>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron actividades con los criterios de búsqueda.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminClientActivity;
