
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import BeLoopIcon from "@/components/BeLoopIcons";

const AdminSettings = () => {
  // Estados para los formularios
  const [companyName, setCompanyName] = useState('BeLoop');
  const [supportEmail, setSupportEmail] = useState('soporte@beloop.com');
  const [notifyNewClients, setNotifyNewClients] = useState(true);
  const [notifyComplianceIssues, setNotifyComplianceIssues] = useState(true);
  const [notifySupportTickets, setNotifySupportTickets] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Administre la configuración de la plataforma
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-none bg-transparent p-0">
              <TabsTrigger
                value="general"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-b-transparent px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-primary"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-b-transparent px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-primary"
              >
                Notificaciones
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-b-transparent px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-primary"
              >
                Integraciones
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-b-transparent px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-primary"
              >
                Seguridad
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="general" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Administre la configuración general de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Compañía</Label>
                  <Input 
                    id="companyName" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Este nombre se mostrará en correos electrónicos y notificaciones.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Correo de Soporte</Label>
                  <Input 
                    id="supportEmail" 
                    type="email" 
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Las solicitudes de soporte se enviarán a esta dirección.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Apariencia</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col items-center justify-between rounded-md border p-4">
                      <div className="mb-3 h-24 w-24 rounded-md bg-gray-200 dark:bg-gray-800"></div>
                      <p className="text-sm font-medium">Logotipo predeterminado</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Cambiar
                      </Button>
                    </div>
                    <div className="flex flex-col items-center justify-between rounded-md border p-4">
                      <div className="mb-3 h-24 w-24 rounded-md bg-primary"></div>
                      <p className="text-sm font-medium">Color principal</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Cambiar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>
                Gestione cómo y cuándo recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nuevos Clientes</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando un nuevo cliente se registre en la plataforma
                    </p>
                  </div>
                  <Switch 
                    checked={notifyNewClients} 
                    onCheckedChange={setNotifyNewClients}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Problemas de Cumplimiento</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando un cliente tenga problemas críticos de cumplimiento
                    </p>
                  </div>
                  <Switch 
                    checked={notifyComplianceIssues} 
                    onCheckedChange={setNotifyComplianceIssues}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tickets de Soporte</p>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando se abra un nuevo ticket de soporte
                    </p>
                  </div>
                  <Switch 
                    checked={notifySupportTickets} 
                    onCheckedChange={setNotifySupportTickets}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Canales de Notificación</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Correo Electrónico</p>
                        <p className="text-sm text-muted-foreground">
                          Enviar notificaciones por correo electrónico
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notificaciones en Navegador</p>
                        <p className="text-sm text-muted-foreground">
                          Mostrar notificaciones en el navegador cuando esté en línea
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integraciones</CardTitle>
              <CardDescription>
                Gestione las integraciones con servicios externos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_110px] items-center p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <BeLoopIcon name="database" className="mr-2" size={20} />
                      <span className="text-base font-medium">Base de Datos</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Conexión a base de datos principal
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-[1fr_110px] items-center p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <BeLoopIcon name="mail" className="mr-2" size={20} />
                      <span className="text-base font-medium">Servidor SMTP</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Servicio de envío de correos electrónicos
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-[1fr_110px] items-center p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <BeLoopIcon name="fileText" className="mr-2" size={20} />
                      <span className="text-base font-medium">API Documentos</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Integración con API de procesamiento de documentos
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-[1fr_110px] items-center p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <BeLoopIcon name="barChart" className="mr-2" size={20} />
                      <span className="text-base font-medium">API Analytics</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Integración con servicio de analítica avanzada
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>
                Administre la configuración de seguridad de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticación de dos factores</p>
                    <p className="text-sm text-muted-foreground">
                      Requerir 2FA para todos los usuarios administradores
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sesiones Simultáneas</p>
                    <p className="text-sm text-muted-foreground">
                      Permitir sesiones simultáneas para los usuarios
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Tiempo de expiración de sesión</p>
                    <p className="text-sm text-muted-foreground">
                      Tiempo de inactividad antes de cerrar sesión automáticamente
                    </p>
                  </div>
                  <div className="w-[180px]">
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="120">2 horas</option>
                    </select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Política de contraseñas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Longitud mínima</p>
                      </div>
                      <div className="w-[180px]">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option value="8">8 caracteres</option>
                          <option value="10">10 caracteres</option>
                          <option value="12">12 caracteres</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Requerir caracteres especiales</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Expiración de contraseña</p>
                      </div>
                      <div className="w-[180px]">
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option value="30">30 días</option>
                          <option value="60">60 días</option>
                          <option value="90">90 días</option>
                          <option value="0">Nunca</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
