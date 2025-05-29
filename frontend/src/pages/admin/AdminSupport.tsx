
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BeLoopIcon from "@/components/BeLoopIcons";

// Datos simulados de tickets
const tickets = [
  {
    id: 'TKT-1234',
    title: 'Error al generar reporte de cumplimiento',
    client: 'Industrias XYZ',
    status: 'open',
    priority: 'high',
    createdAt: '2023-05-04T10:30:00',
    assignedTo: 'Miguel Torres'
  },
  {
    id: 'TKT-1233',
    title: 'Problemas con la carga de documentos',
    client: 'ABC Corp',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2023-05-03T14:15:00',
    assignedTo: 'Carmen Rodríguez'
  },
  {
    id: 'TKT-1232',
    title: 'Solicitud de acceso a módulo adicional',
    client: 'Global Textil',
    status: 'waiting',
    priority: 'low',
    createdAt: '2023-05-02T09:45:00',
    assignedTo: 'Sin asignar'
  },
  {
    id: 'TKT-1231',
    title: 'Duda sobre proceso de certificación',
    client: 'Retail Master',
    status: 'open',
    priority: 'medium',
    createdAt: '2023-05-01T16:20:00',
    assignedTo: 'Sin asignar'
  },
  {
    id: 'TKT-1230',
    title: 'Error en formulario de registro',
    client: 'Tech Solutions',
    status: 'closed',
    priority: 'high',
    createdAt: '2023-04-30T11:10:00',
    assignedTo: 'Jorge Ramírez'
  },
];

const AdminSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filtrar tickets por búsqueda y estado
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'open') return matchesSearch && ticket.status === 'open';
    if (activeTab === 'in-progress') return matchesSearch && ticket.status === 'in-progress';
    if (activeTab === 'waiting') return matchesSearch && ticket.status === 'waiting';
    if (activeTab === 'closed') return matchesSearch && ticket.status === 'closed';
    
    return matchesSearch;
  });

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Obtener color de badge según prioridad
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge variant="secondary">Media</Badge>;
      case 'low':
        return <Badge variant="outline">Baja</Badge>;
      default:
        return <Badge variant="outline">Baja</Badge>;
    }
  };

  // Obtener color de badge según estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default">Abierto</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">En Progreso</Badge>;
      case 'waiting':
        return <Badge className="bg-yellow-500">En Espera</Badge>;
      case 'closed':
        return <Badge variant="secondary">Cerrado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Centro de Soporte</h2>
          <p className="text-muted-foreground">
            Gestione tickets de soporte y consultas de clientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Buscar ticket..." 
            className="w-full md:w-80" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>
            <BeLoopIcon name="plus" className="mr-2" size={16} />
            Nuevo Ticket
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Abiertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <div className="flex items-center text-sm text-amber-500 mt-1">
              <BeLoopIcon name="alertTriangle" size={16} className="mr-1" />
              <span>8 de alta prioridad</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tiempo de Respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.4h</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <BeLoopIcon name="trendingDown" size={16} className="mr-1" />
              <span>-15min vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Resueltos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <BeLoopIcon name="trendingUp" size={16} className="mr-1" />
              <span>+12% este mes</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Satisfacción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94%</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <BeLoopIcon name="thumbsUp" size={16} className="mr-1" />
              <span>+2% vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle>Tickets de Soporte</CardTitle>
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="open">Abiertos</TabsTrigger>
                <TabsTrigger value="in-progress">En Progreso</TabsTrigger>
                <TabsTrigger value="waiting">En Espera</TabsTrigger>
                <TabsTrigger value="closed">Cerrados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Lista de tickets de soporte y consultas de clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="hidden lg:table-cell">Asignado a</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.client}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(ticket.createdAt)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {ticket.assignedTo}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <BeLoopIcon name="eye" size={16} className="mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No se encontraron tickets con los criterios de búsqueda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSupport;
