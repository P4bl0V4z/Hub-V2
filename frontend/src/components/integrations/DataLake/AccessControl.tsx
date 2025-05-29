
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, User, Shield, Search, Clock, UserCheck, UserX, FileCheck, Edit, Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HelpTooltip from '@/components/HelpTooltip';

const AccessControl = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("users");
  const [showDialog, setShowDialog] = useState(false);

  // Sample data for users
  const usersData = [
    {
      id: "U001",
      name: "Ana García",
      role: "Administrador",
      email: "ana.garcia@basf.com",
      lastAccess: "2025-05-05 10:45",
      permissions: {
        view: true,
        edit: true,
        delete: true,
        export: true,
      }
    },
    {
      id: "U002",
      name: "Carlos Rodríguez",
      role: "Analista",
      email: "carlos.rodriguez@basf.com",
      lastAccess: "2025-05-05 09:30",
      permissions: {
        view: true,
        edit: true,
        delete: false,
        export: true,
      }
    },
    {
      id: "U003",
      name: "Sofía Martínez",
      role: "Visitante",
      email: "sofia.martinez@basf.com",
      lastAccess: "2025-05-04 16:15",
      permissions: {
        view: true,
        edit: false,
        delete: false,
        export: false,
      }
    },
  ];

  // Sample data for API keys
  const apiKeysData = [
    {
      id: "API-123456",
      name: "SAP Integration",
      created: "2025-04-15",
      expires: "2025-10-15",
      lastUsed: "2025-05-05 09:15",
      status: "active",
    },
    {
      id: "API-234567",
      name: "IoT Platform",
      created: "2025-03-20",
      expires: "2025-09-20",
      lastUsed: "2025-05-04 22:30",
      status: "active",
    },
    {
      id: "API-345678",
      name: "External Dashboard",
      created: "2025-02-10",
      expires: "2025-08-10",
      lastUsed: "2025-04-28 14:45",
      status: "revoked",
    },
  ];

  // Sample data for activity logs
  const activityLogsData = [
    {
      id: "LOG-001",
      user: "Ana García",
      action: "Modificación de permisos",
      details: "Cambio de permisos para 'Carlos Rodríguez'",
      timestamp: "2025-05-05 10:45",
    },
    {
      id: "LOG-002",
      user: "Sistema",
      action: "Sincronización automática",
      details: "Sincronización completa de datos de SAP ERP",
      timestamp: "2025-05-05 09:00",
    },
    {
      id: "LOG-003",
      user: "Carlos Rodríguez",
      action: "Exportación de datos",
      details: "Exportación de datos de productos a CSV",
      timestamp: "2025-05-05 08:30",
    },
    {
      id: "LOG-004",
      user: "Sofía Martínez",
      action: "Acceso a datos",
      details: "Visualización de datos de huella de carbono",
      timestamp: "2025-05-04 16:15",
    },
    {
      id: "LOG-005",
      user: "Admin",
      action: "Generación de API key",
      details: "Creación de API key 'IoT Platform'",
      timestamp: "2025-03-20 11:20",
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleAddUser = () => {
    toast({
      title: "Usuario añadido",
      description: "Se ha añadido el usuario con éxito",
    });
    setShowDialog(false);
  };

  const handleGenerateKey = () => {
    toast({
      title: "Clave API generada",
      description: "La nueva clave API ha sido generada exitosamente",
    });
    setShowDialog(false);
  };

  // Function to get initial avatar letters
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Permisos y Accesos</h2>
        <div className="flex gap-2">
          {activeTab === "users" && (
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Añadir Usuario</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Agregue un nuevo usuario con acceso a DataLake
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input id="name" className="col-span-3" placeholder="Nombre completo" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" className="col-span-3" placeholder="correo@ejemplo.com" type="email" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Rol
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="analyst">Analista</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Visitante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <h3 className="font-medium">Permisos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="view" defaultChecked />
                      <Label htmlFor="view">Ver datos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="edit" />
                      <Label htmlFor="edit">Editar datos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="delete" />
                      <Label htmlFor="delete">Eliminar datos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="export" />
                      <Label htmlFor="export">Exportar datos</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
                  <Button onClick={handleAddUser}>Añadir Usuario</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {activeTab === "api" && (
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span>Generar API Key</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Generar Nueva API Key</DialogTitle>
                  <DialogDescription>
                    Configure los detalles para la nueva clave API
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="key-name" className="text-right">
                      Nombre
                    </Label>
                    <Input id="key-name" className="col-span-3" placeholder="Nombre descriptivo" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expiration" className="text-right">
                      Expiración
                    </Label>
                    <Select defaultValue="6m">
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 mes</SelectItem>
                        <SelectItem value="3m">3 meses</SelectItem>
                        <SelectItem value="6m">6 meses</SelectItem>
                        <SelectItem value="12m">12 meses</SelectItem>
                        <SelectItem value="never">No expira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <h3 className="font-medium">Permisos de acceso</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="read" defaultChecked />
                      <Label htmlFor="read">Lectura</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="write" />
                      <Label htmlFor="write">Escritura</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
                  <Button onClick={handleGenerateKey}>Generar Clave</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            <span>Registros de Actividad</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Gestión de Usuarios</span>
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar usuarios..." className="pl-10" />
                </div>
              </div>
              <CardDescription>
                Controle qué usuarios tienen acceso al sistema DataLake
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Último acceso</TableHead>
                      <TableHead>Permisos</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              user.role === "Administrador" ? "bg-blue-50 text-blue-800 border-blue-200" : 
                              user.role === "Analista" ? "bg-green-50 text-green-800 border-green-200" : 
                              "bg-gray-50 text-gray-800 border-gray-200"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{user.lastAccess}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {user.permissions.view && <Badge variant="secondary" className="px-1.5 py-0 text-xs">Ver</Badge>}
                            {user.permissions.edit && <Badge variant="secondary" className="px-1.5 py-0 text-xs">Editar</Badge>}
                            {user.permissions.delete && <Badge variant="secondary" className="px-1.5 py-0 text-xs">Eliminar</Badge>}
                            {user.permissions.export && <Badge variant="secondary" className="px-1.5 py-0 text-xs">Exportar</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  <span>API Keys</span>
                </CardTitle>
              </div>
              <CardDescription>
                Gestione las claves API para acceso programático a DataLake
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Creada</TableHead>
                      <TableHead>Expira</TableHead>
                      <TableHead>Último uso</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeysData.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-mono text-sm">{key.id}</TableCell>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>{key.created}</TableCell>
                        <TableCell>{key.expires}</TableCell>
                        <TableCell>{key.lastUsed}</TableCell>
                        <TableCell>
                          {key.status === "active" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                              Activa
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                              Revocada
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" disabled={key.status !== "active"}>
                            {key.status === "active" ? "Revocar" : "Eliminada"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <span>Registro de Actividad</span>
                </CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las actividades</SelectItem>
                    <SelectItem value="access">Accesos</SelectItem>
                    <SelectItem value="modifications">Modificaciones</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Historial de acciones realizadas en la plataforma DataLake
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead className="w-[40%]">Detalles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogsData.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">Ver historial completo</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessControl;
