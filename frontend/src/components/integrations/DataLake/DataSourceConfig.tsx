import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, Database, Plus, RefreshCw, Settings, ArrowRight, ArrowLeft, Play, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import HelpTooltip from '@/components/HelpTooltip';

const DataSourceConfig = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [connTestDialog, setConnTestDialog] = useState(false);

  const connectedSources = [
    {
      id: "erp-001",
      name: "SAP ERP",
      type: "ERP",
      lastSync: "2025-05-05 09:23",
      status: "active",
      frequency: "Cada 4 horas",
      fields: 124
    },
    {
      id: "iot-065",
      name: "Sensores Planta Barcelona",
      type: "IoT",
      lastSync: "2025-05-05 08:45",
      status: "active",
      frequency: "Tiempo real",
      fields: 36
    },
    {
      id: "csv-023",
      name: "Informes Mensuales",
      type: "CSV",
      lastSync: "2025-05-01 00:15",
      status: "warning",
      frequency: "Mensual",
      fields: 52
    },
    {
      id: "api-012",
      name: "API Proveedores",
      type: "API",
      lastSync: "2025-05-04 18:45",
      status: "error",
      frequency: "Diaria",
      fields: 28
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleTestConnection = () => {
    toast({
      title: "Prueba de conexión exitosa",
      description: "La conexión con SAP ERP se ha establecido correctamente.",
    });
    setConnTestDialog(false);
  };

  const handleSyncNow = (source: string) => {
    toast({
      title: "Sincronización iniciada",
      description: `Sincronizando datos desde ${source}...`,
    });
  };

  // Get status badge style based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Activa</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">Advertencias</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Error</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuración de Fuentes de Datos</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Añadir Fuente</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Añadir Nueva Fuente de Datos</DialogTitle>
              <DialogDescription>
                Conecte una nueva fuente de datos a su DataLake
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source-name" className="text-right">
                  Nombre
                </Label>
                <Input id="source-name" className="col-span-3" placeholder="Ej: SAP ERP" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source-type" className="text-right">
                  Tipo
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erp">Sistema ERP</SelectItem>
                    <SelectItem value="iot">Dispositivos IoT</SelectItem>
                    <SelectItem value="csv">Archivos CSV/Excel</SelectItem>
                    <SelectItem value="api">API Externa</SelectItem>
                    <SelectItem value="db">Base de Datos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="connection-string" className="text-right">
                  Conexión
                </Label>
                <Input id="connection-string" className="col-span-3" placeholder="Cadena de conexión o URL" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sync-freq" className="text-right">
                  Frecuencia
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Frecuencia de sincronización" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Tiempo real</SelectItem>
                    <SelectItem value="hourly">Cada hora</SelectItem>
                    <SelectItem value="daily">Diaria</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Validación
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch id="validation" />
                  <Label htmlFor="validation">Validar datos al importar</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Añadir Fuente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Todas ({connectedSources.length})</TabsTrigger>
          <TabsTrigger value="erp">ERP (1)</TabsTrigger>
          <TabsTrigger value="iot">IoT (1)</TabsTrigger>
          <TabsTrigger value="csv">CSV (1)</TabsTrigger>
          <TabsTrigger value="api">API (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {connectedSources.map((source) => (
            <Card key={source.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle>{source.name}</CardTitle>
                    {getStatusBadge(source.status)}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Configuración de {source.name}</DialogTitle>
                        <DialogDescription>
                          Ajuste los parámetros de conexión y sincronización
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label>ID de Conexión</Label>
                          <Input readOnly value={source.id} />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Input readOnly value={source.type} />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Nombre de la Fuente</Label>
                          <Input defaultValue={source.name} />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Cadena de Conexión</Label>
                          <Input type="password" value="••••••••••••••••••••••" />
                        </div>
                        <div className="space-y-2">
                          <Label>Frecuencia de Sincronización</Label>
                          <Select defaultValue="4h">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">Tiempo real</SelectItem>
                              <SelectItem value="1h">Cada hora</SelectItem>
                              <SelectItem value="4h">Cada 4 horas</SelectItem>
                              <SelectItem value="12h">Cada 12 horas</SelectItem>
                              <SelectItem value="daily">Diaria</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Último sincronizado</Label>
                          <Input readOnly value={source.lastSync} />
                        </div>
                        <div className="col-span-2 flex items-center space-x-2 mt-2">
                          <Switch id="validate-data" defaultChecked />
                          <Label htmlFor="validate-data">
                            Validar datos durante la sincronización
                          </Label>
                        </div>
                      </div>
                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setConnTestDialog(true)} 
                            className="flex items-center gap-2"
                          >
                            <Play className="h-4 w-4" />
                            <span>Probar Conexión</span>
                          </Button>
                          <Button 
                            variant="secondary" 
                            onClick={() => handleSyncNow(source.name)}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Sincronizar ahora</span>
                          </Button>
                        </div>
                        <Button type="submit">Guardar Cambios</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  Tipo: {source.type} • {source.fields} campos • Sincronización: {source.frequency}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                {source.status === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Error de conexión</p>
                        <p className="text-sm text-red-700">No se pudo establecer conexión con el origen de datos. Revise las credenciales.</p>
                      </div>
                    </div>
                  </div>
                )}

                {source.status === "warning" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Validación incompleta</p>
                        <p className="text-sm text-amber-700">Hay 8 registros que no cumplen con los criterios de validación.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Última sincronización: {source.lastSync}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleSyncNow(source.name)}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Sincronizar</span>
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>Ver Mapeo</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="erp" className="space-y-4">
          {connectedSources
            .filter(source => source.type === "ERP")
            .map((source) => (
              <Card key={source.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <CardTitle>{source.name}</CardTitle>
                      {getStatusBadge(source.status)}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Configuración de {source.name}</DialogTitle>
                          <DialogDescription>
                            Ajuste los parámetros de conexión y sincronización
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="space-y-2">
                            <Label>ID de Conexión</Label>
                            <Input readOnly value={source.id} />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Input readOnly value={source.type} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Nombre de la Fuente</Label>
                            <Input defaultValue={source.name} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Cadena de Conexión</Label>
                            <Input type="password" value="••••••••••••••••••••••" />
                          </div>
                          <div className="space-y-2">
                            <Label>Frecuencia de Sincronización</Label>
                            <Select defaultValue="4h">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="realtime">Tiempo real</SelectItem>
                                <SelectItem value="1h">Cada hora</SelectItem>
                                <SelectItem value="4h">Cada 4 horas</SelectItem>
                                <SelectItem value="12h">Cada 12 horas</SelectItem>
                                <SelectItem value="daily">Diaria</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Último sincronizado</Label>
                            <Input readOnly value={source.lastSync} />
                          </div>
                          <div className="col-span-2 flex items-center space-x-2 mt-2">
                            <Switch id="validate-data" defaultChecked />
                            <Label htmlFor="validate-data">
                              Validar datos durante la sincronización
                            </Label>
                          </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1 flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setConnTestDialog(true)} 
                              className="flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              <span>Probar Conexión</span>
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={() => handleSyncNow(source.name)}
                              className="flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span>Sincronizar ahora</span>
                            </Button>
                          </div>
                          <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <CardDescription>
                    Tipo: {source.type} • {source.fields} campos • Sincronización: {source.frequency}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  {source.status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Error de conexión</p>
                          <p className="text-sm text-red-700">No se pudo establecer conexión con el origen de datos. Revise las credenciales.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {source.status === "warning" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">Validación incompleta</p>
                          <p className="text-sm text-amber-700">Hay 8 registros que no cumplen con los criterios de validación.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Última sincronización: {source.lastSync}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSyncNow(source.name)}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Sincronizar</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span>Ver Mapeo</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="iot" className="space-y-4">
          {connectedSources
            .filter(source => source.type === "IoT")
            .map((source) => (
              <Card key={source.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <CardTitle>{source.name}</CardTitle>
                      {getStatusBadge(source.status)}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Configuración de {source.name}</DialogTitle>
                          <DialogDescription>
                            Ajuste los parámetros de conexión y sincronización
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="space-y-2">
                            <Label>ID de Conexión</Label>
                            <Input readOnly value={source.id} />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Input readOnly value={source.type} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Nombre de la Fuente</Label>
                            <Input defaultValue={source.name} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Cadena de Conexión</Label>
                            <Input type="password" value="••••••••••••••••••••••" />
                          </div>
                          <div className="space-y-2">
                            <Label>Frecuencia de Sincronización</Label>
                            <Select defaultValue="4h">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="realtime">Tiempo real</SelectItem>
                                <SelectItem value="1h">Cada hora</SelectItem>
                                <SelectItem value="4h">Cada 4 horas</SelectItem>
                                <SelectItem value="12h">Cada 12 horas</SelectItem>
                                <SelectItem value="daily">Diaria</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Último sincronizado</Label>
                            <Input readOnly value={source.lastSync} />
                          </div>
                          <div className="col-span-2 flex items-center space-x-2 mt-2">
                            <Switch id="validate-data" defaultChecked />
                            <Label htmlFor="validate-data">
                              Validar datos durante la sincronización
                            </Label>
                          </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1 flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setConnTestDialog(true)} 
                              className="flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              <span>Probar Conexión</span>
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={() => handleSyncNow(source.name)}
                              className="flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span>Sincronizar ahora</span>
                            </Button>
                          </div>
                          <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <CardDescription>
                    Tipo: {source.type} • {source.fields} campos • Sincronización: {source.frequency}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  {source.status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Error de conexión</p>
                          <p className="text-sm text-red-700">No se pudo establecer conexión con el origen de datos. Revise las credenciales.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {source.status === "warning" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">Validación incompleta</p>
                          <p className="text-sm text-amber-700">Hay 8 registros que no cumplen con los criterios de validación.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Última sincronización: {source.lastSync}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSyncNow(source.name)}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Sincronizar</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span>Ver Mapeo</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="csv" className="space-y-4">
          {connectedSources
            .filter(source => source.type === "CSV")
            .map((source) => (
              <Card key={source.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <CardTitle>{source.name}</CardTitle>
                      {getStatusBadge(source.status)}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Configuración de {source.name}</DialogTitle>
                          <DialogDescription>
                            Ajuste los parámetros de conexión y sincronización
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="space-y-2">
                            <Label>ID de Conexión</Label>
                            <Input readOnly value={source.id} />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Input readOnly value={source.type} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Nombre de la Fuente</Label>
                            <Input defaultValue={source.name} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Cadena de Conexión</Label>
                            <Input type="password" value="••••••••••••••••••••••" />
                          </div>
                          <div className="space-y-2">
                            <Label>Frecuencia de Sincronización</Label>
                            <Select defaultValue="4h">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="realtime">Tiempo real</SelectItem>
                                <SelectItem value="1h">Cada hora</SelectItem>
                                <SelectItem value="4h">Cada 4 horas</SelectItem>
                                <SelectItem value="12h">Cada 12 horas</SelectItem>
                                <SelectItem value="daily">Diaria</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Último sincronizado</Label>
                            <Input readOnly value={source.lastSync} />
                          </div>
                          <div className="col-span-2 flex items-center space-x-2 mt-2">
                            <Switch id="validate-data" defaultChecked />
                            <Label htmlFor="validate-data">
                              Validar datos durante la sincronización
                            </Label>
                          </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1 flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setConnTestDialog(true)} 
                              className="flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              <span>Probar Conexión</span>
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={() => handleSyncNow(source.name)}
                              className="flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span>Sincronizar ahora</span>
                            </Button>
                          </div>
                          <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <CardDescription>
                    Tipo: {source.type} • {source.fields} campos • Sincronización: {source.frequency}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  {source.status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Error de conexión</p>
                          <p className="text-sm text-red-700">No se pudo establecer conexión con el origen de datos. Revise las credenciales.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {source.status === "warning" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">Validación incompleta</p>
                          <p className="text-sm text-amber-700">Hay 8 registros que no cumplen con los criterios de validación.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Última sincronización: {source.lastSync}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSyncNow(source.name)}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Sincronizar</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span>Ver Mapeo</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          {connectedSources
            .filter(source => source.type === "API")
            .map((source) => (
              <Card key={source.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      <CardTitle>{source.name}</CardTitle>
                      {getStatusBadge(source.status)}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Configuración de {source.name}</DialogTitle>
                          <DialogDescription>
                            Ajuste los parámetros de conexión y sincronización
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="space-y-2">
                            <Label>ID de Conexión</Label>
                            <Input readOnly value={source.id} />
                          </div>
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Input readOnly value={source.type} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Nombre de la Fuente</Label>
                            <Input defaultValue={source.name} />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Cadena de Conexión</Label>
                            <Input type="password" value="••••••••••••••••••••••" />
                          </div>
                          <div className="space-y-2">
                            <Label>Frecuencia de Sincronización</Label>
                            <Select defaultValue="4h">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="realtime">Tiempo real</SelectItem>
                                <SelectItem value="1h">Cada hora</SelectItem>
                                <SelectItem value="4h">Cada 4 horas</SelectItem>
                                <SelectItem value="12h">Cada 12 horas</SelectItem>
                                <SelectItem value="daily">Diaria</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Último sincronizado</Label>
                            <Input readOnly value={source.lastSync} />
                          </div>
                          <div className="col-span-2 flex items-center space-x-2 mt-2">
                            <Switch id="validate-data" defaultChecked />
                            <Label htmlFor="validate-data">
                              Validar datos durante la sincronización
                            </Label>
                          </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1 flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setConnTestDialog(true)} 
                              className="flex items-center gap-2"
                            >
                              <Play className="h-4 w-4" />
                              <span>Probar Conexión</span>
                            </Button>
                            <Button 
                              variant="secondary" 
                              onClick={() => handleSyncNow(source.name)}
                              className="flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span>Sincronizar ahora</span>
                            </Button>
                          </div>
                          <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <CardDescription>
                    Tipo: {source.type} • {source.fields} campos • Sincronización: {source.frequency}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  {source.status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Error de conexión</p>
                          <p className="text-sm text-red-700">No se pudo establecer conexión con el origen de datos. Revise las credenciales.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {source.status === "warning" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">Validación incompleta</p>
                          <p className="text-sm text-amber-700">Hay 8 registros que no cumplen con los criterios de validación.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Última sincronización: {source.lastSync}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSyncNow(source.name)}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Sincronizar</span>
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span>Ver Mapeo</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Connection Test Dialog */}
      <Dialog open={connTestDialog} onOpenChange={setConnTestDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Prueba de Conexión</DialogTitle>
            <DialogDescription>
              Verificando la conexión con SAP ERP...
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <Check className="h-12 w-12 text-green-500 bg-green-50 p-2 rounded-full" />
              <p className="text-xl font-medium text-green-700">Conexión exitosa</p>
              <p className="text-center text-muted-foreground">
                La conexión con SAP ERP se ha establecido correctamente.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setConnTestDialog(false)}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataSourceConfig;
