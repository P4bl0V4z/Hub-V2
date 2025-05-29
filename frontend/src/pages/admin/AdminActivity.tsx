
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BeLoopIcon from "@/components/BeLoopIcons";
import { cn } from "@/lib/utils";

// Datos simulados de actividad
const activities = [
  {
    id: 1,
    user: 'Jorge Ramírez',
    role: 'Administrador',
    action: 'Creó nuevo cliente',
    resource: 'Empresa XYZ',
    timestamp: '2023-05-04T14:30:00',
    details: 'Registro de nuevo cliente con plan Premium',
    category: 'create'
  },
  {
    id: 2,
    user: 'Alejandra Silva',
    role: 'Analista',
    action: 'Generó reporte',
    resource: 'Reporte de cumplimiento',
    timestamp: '2023-05-03T10:15:00',
    details: 'Reporte mensual de cumplimiento para Industrias ABC',
    category: 'report'
  },
  {
    id: 3,
    user: 'Sistema',
    role: 'Automatización',
    action: 'Alerta de cumplimiento',
    resource: 'Global Textil',
    timestamp: '2023-05-02T16:45:00',
    details: 'Alerta de documentos próximos a vencer en 30 días',
    category: 'alert'
  },
  {
    id: 4,
    user: 'Miguel Torres',
    role: 'Soporte',
    action: 'Resolvió ticket',
    resource: 'Ticket #1230',
    timestamp: '2023-05-02T11:20:00',
    details: 'Resolución de problema de acceso para usuario en Tech Solutions',
    category: 'support'
  },
  {
    id: 5,
    user: 'Carmen Rodríguez',
    role: 'Gerente',
    action: 'Modificó permisos',
    resource: 'Grupo de usuarios',
    timestamp: '2023-05-01T09:10:00',
    details: 'Actualización de permisos para el grupo de analistas',
    category: 'security'
  },
  {
    id: 6,
    user: 'Felipe García',
    role: 'Analista',
    action: 'Exportó datos',
    resource: 'Lista de clientes',
    timestamp: '2023-04-30T15:25:00',
    details: 'Exportación de datos de clientes en formato Excel',
    category: 'export'
  },
  {
    id: 7,
    user: 'Sistema',
    role: 'Automatización',
    action: 'Respaldo de datos',
    resource: 'Base de datos',
    timestamp: '2023-04-30T01:00:00',
    details: 'Respaldo automático programado de la base de datos',
    category: 'system'
  },
  {
    id: 8,
    user: 'Jorge Ramírez',
    role: 'Administrador',
    action: 'Configuró integración',
    resource: 'API Documentos',
    timestamp: '2023-04-29T14:15:00',
    details: 'Configuración de nueva integración con API de procesamiento de documentos',
    category: 'system'
  },
  {
    id: 9,
    user: 'Alejandra Silva',
    role: 'Analista',
    action: 'Actualizó cliente',
    resource: 'Retail Master',
    timestamp: '2023-04-28T09:45:00',
    details: 'Actualización de información de contacto y dirección',
    category: 'update'
  },
  {
    id: 10,
    user: 'Miguel Torres',
    role: 'Soporte',
    action: 'Creó ticket',
    resource: 'Ticket #1231',
    timestamp: '2023-04-27T16:30:00',
    details: 'Creación de nuevo ticket para consulta de Global Textil',
    category: 'support'
  }
];

const AdminActivity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
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
      case 'create': return 'plus';
      case 'update': return 'edit';
      case 'alert': return 'alertCircle';
      case 'report': return 'barChart';
      case 'export': return 'download';
      case 'security': return 'shield';
      case 'system': return 'settings';
      case 'support': return 'messageCircle';
      default: return 'activity';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registro de Actividad</h2>
          <p className="text-muted-foreground">
            Monitoree todas las acciones realizadas en la plataforma
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Buscar actividad..." 
            className="w-full md:w-80" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>
            <BeLoopIcon name="download" className="mr-2" size={16} />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle>Registro de Actividades</CardTitle>
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
                <TabsTrigger value="system">Sistema</TabsTrigger>
                <TabsTrigger value="alert">Alertas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Historial completo de acciones y eventos
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    <span className="text-xs text-muted-foreground ml-2">({activity.role})</span>
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

            {filteredActivities.length > 0 && (
              <div className="flex justify-center mt-8">
                <Button variant="outline">
                  <BeLoopIcon name="moreHorizontal" className="mr-2" size={16} />
                  Cargar más actividades
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivity;
