
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BeLoopIcon from "@/components/BeLoopIcons";

// Datos simulados de usuarios
const users = [
  {
    id: 1,
    name: 'Jorge Ramírez',
    email: 'jorge.ramirez@beloop.com',
    role: 'Administrador',
    status: 'active',
    lastLogin: '2023-05-04T14:30:00'
  },
  {
    id: 2,
    name: 'Alejandra Silva',
    email: 'alejandra.silva@beloop.com',
    role: 'Analista',
    status: 'active',
    lastLogin: '2023-05-03T10:15:00'
  },
  {
    id: 3,
    name: 'Miguel Torres',
    email: 'miguel.torres@beloop.com',
    role: 'Soporte',
    status: 'active',
    lastLogin: '2023-05-02T16:45:00'
  },
  {
    id: 4,
    name: 'Carmen Rodríguez',
    email: 'carmen.rodriguez@beloop.com',
    role: 'Gerente',
    status: 'inactive',
    lastLogin: '2023-04-28T11:20:00'
  },
  {
    id: 5,
    name: 'Felipe García',
    email: 'felipe.garcia@beloop.com',
    role: 'Analista',
    status: 'active',
    lastLogin: '2023-05-04T09:10:00'
  }
];

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h2>
          <p className="text-muted-foreground">
            Administre los usuarios internos y sus permisos en la plataforma
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Input 
            placeholder="Buscar usuario..." 
            className="w-full md:w-80" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>
            <BeLoopIcon name="plus" className="mr-2" size={16} />
            Nuevo Usuario
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Internos ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Usuarios con acceso al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      ) : user.role === 'Gerente' ? (
                        <Badge variant="secondary">{user.role}</Badge>
                      ) : (
                        <Badge variant="outline">{user.role}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(user.lastLogin)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? "success" : "secondary"}>
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <BeLoopIcon name="moreVertical" size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <BeLoopIcon name="edit" size={16} className="mr-2" />
                            Editar usuario
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BeLoopIcon name="key" size={16} className="mr-2" />
                            Cambiar permisos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BeLoopIcon name="refreshCcw" size={16} className="mr-2" />
                            Reiniciar contraseña
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <DropdownMenuItem>
                              <BeLoopIcon name="userX" size={16} className="mr-2" />
                              Desactivar usuario
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <BeLoopIcon name="userCheck" size={16} className="mr-2" />
                              Activar usuario
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      <Card>
        <CardHeader>
          <CardTitle>Roles y Permisos</CardTitle>
          <CardDescription>
            Configuración de los roles de usuarios y sus permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Administrador</TableCell>
                  <TableCell>Acceso completo a todas las funcionalidades del sistema</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <BeLoopIcon name="settings" size={16} className="mr-2" />
                      Configurar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gerente</TableCell>
                  <TableCell>Acceso a métricas y reportes, sin configuración avanzada</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <BeLoopIcon name="settings" size={16} className="mr-2" />
                      Configurar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Analista</TableCell>
                  <TableCell>Acceso a datos y reportes de clientes sin modificación</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <BeLoopIcon name="settings" size={16} className="mr-2" />
                      Configurar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Soporte</TableCell>
                  <TableCell>Acceso a tickets y solicitudes de soporte</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <BeLoopIcon name="settings" size={16} className="mr-2" />
                      Configurar
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
