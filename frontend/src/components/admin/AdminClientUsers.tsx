
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BeLoopIcon from "@/components/BeLoopIcons";

// Datos simulados de usuarios del cliente
const generateUsers = (clientId: number) => {
  return [
    {
      id: 1,
      name: 'María López',
      email: 'maria.lopez@empresa.com',
      role: 'Administrador',
      lastActive: '2023-05-04T14:30:00',
      status: 'active'
    },
    {
      id: 2,
      name: 'Pedro Gómez',
      email: 'pedro.gomez@empresa.com',
      role: 'Editor',
      lastActive: '2023-05-03T10:15:00',
      status: 'active'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      role: 'Visualizador',
      lastActive: '2023-05-02T16:45:00',
      status: 'active'
    },
    {
      id: 4,
      name: 'Roberto Sánchez',
      email: 'roberto.sanchez@empresa.com',
      role: 'Editor',
      lastActive: '2023-04-28T11:20:00',
      status: 'inactive'
    },
    {
      id: 5,
      name: 'Carmen Rodríguez',
      email: 'carmen.rodriguez@empresa.com',
      role: 'Visualizador',
      lastActive: '2023-05-04T09:10:00',
      status: 'active'
    }
  ];
};

interface AdminClientUsersProps {
  clientId: number;
}

const AdminClientUsers = ({ clientId }: AdminClientUsersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const users = generateUsers(clientId);
  
  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <h3 className="text-xl font-semibold">Usuarios del Cliente</h3>
          <div className="flex gap-2 items-center">
            <Input 
              placeholder="Buscar usuario..." 
              className="max-w-xs" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button>
              <BeLoopIcon name="plus" className="mr-2" size={16} />
              Nuevo Usuario
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="hidden md:table-cell">Último acceso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === 'Administrador' ? (
                      <Badge variant="default">{user.role}</Badge>
                    ) : user.role === 'Editor' ? (
                      <Badge variant="secondary">{user.role}</Badge>
                    ) : (
                      <Badge variant="outline">{user.role}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(user.lastActive)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? "success" : "secondary"}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon">
                        <BeLoopIcon name="edit" size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <BeLoopIcon name="trash" size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron usuarios con los criterios de búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminClientUsers;
