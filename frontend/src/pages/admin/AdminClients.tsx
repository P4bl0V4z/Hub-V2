
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Datos simulados de clientes
const clients = [
  { 
    id: 1, 
    name: 'Industrias XYZ', 
    industry: 'Manufactura',
    users: 48,
    complianceRate: 95,
    status: 'active',
    lastLogin: '2023-05-02T10:30:00',
    subscription: 'Premium'
  },
  { 
    id: 2, 
    name: 'ABC Corp', 
    industry: 'Alimentos',
    users: 23,
    complianceRate: 87,
    status: 'active',
    lastLogin: '2023-05-03T14:15:00',
    subscription: 'Standard'
  },
  { 
    id: 3, 
    name: 'Global Textil', 
    industry: 'Textil',
    users: 15,
    complianceRate: 79,
    status: 'active',
    lastLogin: '2023-05-01T09:00:00',
    subscription: 'Basic'
  },
  { 
    id: 4, 
    name: 'Retail Master', 
    industry: 'Retail',
    users: 34,
    complianceRate: 92,
    status: 'active',
    lastLogin: '2023-05-04T11:45:00',
    subscription: 'Premium'
  },
  { 
    id: 5, 
    name: 'Tech Solutions', 
    industry: 'Tecnología',
    users: 12,
    complianceRate: 98,
    status: 'active',
    lastLogin: '2023-05-02T16:20:00',
    subscription: 'Standard'
  },
  { 
    id: 6, 
    name: 'Green Logistics', 
    industry: 'Logística',
    users: 8,
    complianceRate: 85,
    status: 'inactive',
    lastLogin: '2023-04-15T10:30:00',
    subscription: 'Basic'
  },
  { 
    id: 7, 
    name: 'Eco Packaging', 
    industry: 'Manufactura',
    users: 19,
    complianceRate: 91,
    status: 'active',
    lastLogin: '2023-05-03T13:10:00',
    subscription: 'Premium'
  },
  { 
    id: 8, 
    name: 'Agro Industrias', 
    industry: 'Agricultura',
    users: 27,
    complianceRate: 83,
    status: 'active',
    lastLogin: '2023-05-04T09:25:00',
    subscription: 'Standard'
  },
];

const AdminClients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // Filtrar clientes por búsqueda y estado
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && client.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && client.status === 'inactive';
    
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

  const handleRowClick = (clientId: number) => {
    navigate(`/admin/clients/${clientId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h2>
          <p className="text-muted-foreground">
            Administre los clientes y sus datos en BeLoop
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Buscar por nombre o industria..." 
            className="w-full md:w-80" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>
            <BeLoopIcon name="plus" className="mr-2" size={16} />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle>Clientes ({filteredClients.length})</CardTitle>
            <Tabs defaultValue="all" className="w-[240px]" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Activos</TabsTrigger>
                <TabsTrigger value="inactive">Inactivos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Industria</TableHead>
                  <TableHead className="hidden md:table-cell">Usuarios</TableHead>
                  <TableHead className="hidden md:table-cell">Cumplimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Último acceso</TableHead>
                  <TableHead className="hidden lg:table-cell">Plan</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="cursor-pointer"
                    onClick={() => handleRowClick(client.id)}
                  >
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.industry}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.users}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <div className="w-full max-w-[80px] bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              client.complianceRate >= 90 ? 'bg-green-500' : 
                              client.complianceRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${client.complianceRate}%` }}
                          />
                        </div>
                        <span className="text-sm">{client.complianceRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'active' ? "default" : "secondary"}>
                        {client.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(client.lastLogin)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {client.subscription}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <BeLoopIcon name="moreVertical" size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/clients/${client.id}`);
                          }}>
                            <BeLoopIcon name="eye" size={16} className="mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <BeLoopIcon name="edit" size={16} className="mr-2" />
                            Editar cliente
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => e.stopPropagation()}
                            className="text-destructive"
                          >
                            <BeLoopIcon name="trash" size={16} className="mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No se encontraron clientes con los criterios de búsqueda.
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

export default AdminClients;
