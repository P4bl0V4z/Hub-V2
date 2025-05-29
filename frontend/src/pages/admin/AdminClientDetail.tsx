
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BeLoopIcon from "@/components/BeLoopIcons";
import AdminClientUsers from '@/components/admin/AdminClientUsers';
import AdminClientCompliance from '@/components/admin/AdminClientCompliance';
import AdminClientActivity from '@/components/admin/AdminClientActivity';

// Datos simulados de clientes detallados
const clientsDetails = [
  { 
    id: 1, 
    name: 'Industrias XYZ', 
    industry: 'Manufactura',
    users: 48,
    complianceRate: 95,
    status: 'active',
    lastLogin: '2023-05-02T10:30:00',
    subscription: 'Premium',
    contactPerson: 'Juan Pérez',
    contactEmail: 'juan.perez@xyz.com',
    contactPhone: '+56 9 8765 4321',
    address: 'Calle Industria 123, Santiago',
    contractStart: '2022-03-15',
    contractEnd: '2024-03-14'
  },
  // Otros clientes...
];

const AdminClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Buscar el cliente por ID
  const client = clientsDetails.find(c => c.id === Number(id));
  
  // Si no se encuentra el cliente, mostrar mensaje
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-4">Cliente no encontrado</h2>
        <Button onClick={() => navigate('/admin/clients')}>
          Volver a la lista de clientes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/admin/clients')}
          >
            <BeLoopIcon name="arrowLeft" size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{client.name}</h2>
              <Badge variant={client.status === 'active' ? "default" : "secondary"}>
                {client.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {client.industry} · Plan {client.subscription}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <BeLoopIcon name="edit" className="mr-2" size={16} />
            Editar
          </Button>
          <DropdownMenuDemo />
        </div>
      </div>
      
      {/* Información general del cliente */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Contacto:</dt>
                <dd className="font-medium">{client.contactPerson}</dd>
              </div>
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Email:</dt>
                <dd className="font-medium">{client.contactEmail}</dd>
              </div>
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Teléfono:</dt>
                <dd className="font-medium">{client.contactPhone}</dd>
              </div>
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Dirección:</dt>
                <dd className="font-medium">{client.address}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Información del Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Plan:</dt>
                <dd className="font-medium">{client.subscription}</dd>
              </div>
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Fecha inicio:</dt>
                <dd className="font-medium">{formatDate(client.contractStart)}</dd>
              </div>
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Fecha fin:</dt>
                <dd className="font-medium">{formatDate(client.contractEnd)}</dd>
              </div>
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Estado:</dt>
                <dd>
                  <Badge variant={client.status === 'active' ? "default" : "secondary"}>
                    {client.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Estadísticas de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Total usuarios:</dt>
                <dd className="font-medium">{client.users}</dd>
              </div>
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Índice de cumplimiento:</dt>
                <dd className="font-medium">
                  <div className="flex items-center">
                    <span className={`${
                      client.complianceRate >= 90 ? 'text-green-500' : 
                      client.complianceRate >= 80 ? 'text-yellow-500' : 'text-red-500'
                    }`}>{client.complianceRate}%</span>
                  </div>
                </dd>
              </div>
              <div className="flex flex-row justify-between">
                <dt className="text-muted-foreground">Último acceso:</dt>
                <dd className="font-medium">{formatDate(client.lastLogin)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      {/* Pestañas con detalles adicionales */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-3 w-full sm:w-auto">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          <AdminClientUsers clientId={client.id} />
        </TabsContent>
        <TabsContent value="compliance" className="mt-6">
          <AdminClientCompliance clientId={client.id} />
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <AdminClientActivity clientId={client.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Componente para el menú desplegable
const DropdownMenuDemo = () => {
  return (
    <div className="relative inline-block text-left">
      <Button variant="outline" size="icon">
        <BeLoopIcon name="moreVertical" size={16} />
      </Button>
    </div>
  );
};

// Función para formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  }).format(date);
};

export default AdminClientDetail;
