import Sidebar from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, UserCog, Globe, Package, Scale, FileCheck, Ticket, Database } from 'lucide-react';
import BeLoopIcon from "@/components/BeLoopIcons";
import HelpTooltip from '@/components/HelpTooltip';
import SettingsTabPlans from '@/components/SettingsTabPlans';
import Footer from '@/components/Footer';
import VideoTutorialButton from '@/components/VideoTutorialButton';
import GlobalSearch from '@/components/GlobalSearch';
import ChatAssistant from '@/components/ChatAssistant';
import DataLakeIntegration from '@/components/integrations/DataLakeIntegration';

const Settings = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pb-24">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              Perfil
              <HelpTooltip content="Gestiona tus configuraciones de perfil y aplicación" />
            </h1>
            <p className="text-muted-foreground">Ajusta los parámetros del sistema de gestión de ciclo de vida</p>
          </div>
          
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
              <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
              <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
              <TabsTrigger value="datalake">DataLake</TabsTrigger>
              <TabsTrigger value="normativas">Normativas</TabsTrigger>
              <TabsTrigger value="planes">Planes</TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Configuración de la Organización</CardTitle>
                    <HelpTooltip content="Establece la información general de tu organización" />
                  </div>
                  <CardDescription>
                    Datos generales de la organización y preferencias del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Nombre de la Empresa</Label>
                          <Input id="company" defaultValue="BASF Española S.L." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-id">Identificación Fiscal</Label>
                          <Input id="tax-id" defaultValue="B-08200388" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Textarea id="address" defaultValue="Carrer de Tarragona, 161, 08014 Barcelona" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Ciudad</Label>
                          <Input id="city" defaultValue="Barcelona" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">País</Label>
                          <div className="flex items-center gap-2">
                            <Select defaultValue="es">
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un país" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="es">España</SelectItem>
                                <SelectItem value="mx">México</SelectItem>
                                <SelectItem value="co">Colombia</SelectItem>
                                <SelectItem value="ar">Argentina</SelectItem>
                                <SelectItem value="cl">Chile</SelectItem>
                              </SelectContent>
                            </Select>
                            <HelpTooltip content="País donde está registrada tu empresa" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Código Postal</Label>
                          <Input id="zip" defaultValue="08014" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Preferencias del Sistema</h3>
                        <HelpTooltip content="Configura las preferencias generales del sistema" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="timezone" className="block mb-1">Zona Horaria</Label>
                          <div className="flex items-center gap-2">
                            <Select defaultValue="europe-madrid">
                              <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Selecciona zona horaria" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="europe-madrid">Europa/Madrid (UTC+1)</SelectItem>
                                <SelectItem value="america-mexico">América/Ciudad de México (UTC-6)</SelectItem>
                                <SelectItem value="america-bogota">América/Bogotá (UTC-5)</SelectItem>
                                <SelectItem value="america-santiago">América/Santiago (UTC-4)</SelectItem>
                              </SelectContent>
                            </Select>
                            <HelpTooltip content="Zona horaria para fechas y reportes" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Unidades de Medida</Label>
                          <p className="text-sm text-muted-foreground">
                            Sistema de unidades para reportes y análisis
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="metric">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Selecciona unidades" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="metric">Sistema Métrico</SelectItem>
                              <SelectItem value="imperial">Sistema Imperial</SelectItem>
                            </SelectContent>
                          </Select>
                          <HelpTooltip content="Sistema de unidades para cálculos y reportes" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Reportes Automáticos</Label>
                          <p className="text-sm text-muted-foreground">
                            Generar reportes periódicos de trazabilidad
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <HelpTooltip content="Genera y envía reportes periódicamente" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button>Guardar Cambios</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Parámetros de Ciclo de Vida</CardTitle>
                    <HelpTooltip content="Configuraciones para el análisis de ciclo de vida" />
                  </div>
                  <CardDescription>
                    Configuración de métricas para la evaluación del ciclo de vida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium flex items-center gap-1">
                              <Package className="h-4 w-4 text-blue-500" />
                              Indicadores de Producto
                              <HelpTooltip content="Define los indicadores clave para evaluar tus productos" />
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Configuración de parámetros para evaluación de productos
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Configurar</Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium flex items-center gap-1">
                              <Scale className="h-4 w-4 text-green-500" />
                              Cálculo de Huella de Carbono
                              <HelpTooltip content="Configura los parámetros para el cálculo de la huella de carbono" />
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Metodología y factores de emisión
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Configurar</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium flex items-center gap-1">
                              <FileCheck className="h-4 w-4 text-purple-500" />
                              Verificación de Documentos
                              <HelpTooltip content="Configura los requisitos de documentación para trazabilidad" />
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Requisitos documentales para trazabilidad
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Configurar</Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium flex items-center gap-1">
                              <Globe className="h-4 w-4 text-indigo-500" />
                              Requisitos Regionales
                              <HelpTooltip content="Configuración de requisitos específicos por región" />
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Reglas específicas por país o región
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Configurar</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notificaciones Tab */}
            <TabsContent value="notificaciones">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                    <HelpTooltip content="Configura qué notificaciones deseas recibir" />
                  </div>
                  <CardDescription>
                    Gestiona las alertas y notificaciones del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Notificaciones por Email</h3>
                        <HelpTooltip content="Notificaciones que recibirás por correo electrónico" />
                      </div>
                      
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Vencimiento de certificaciones</Label>
                            <p className="text-sm text-muted-foreground">
                              Recibe alertas cuando las certificaciones estén próximas a vencer
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked />
                            <HelpTooltip content="Te notificaremos con 30, 15 y 5 días de anticipación" />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Nuevos requerimientos normativos</Label>
                            <p className="text-sm text-muted-foreground">
                              Notificaciones sobre cambios en la legislación aplicable
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked />
                            <HelpTooltip content="Te informaremos de los cambios en normativas que te aplican" />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Reportes periódicos</Label>
                            <p className="text-sm text-muted-foreground">
                              Informes semanales y mensuales sobre indicadores clave
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch defaultChecked />
                            <HelpTooltip content="Recibirás informes automatizados sobre tus KPIs" />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Incidencias en trazabilidad</Label>
                            <p className="text-sm text-muted-foreground">
                              Alertas sobre interrupciones en la cadena de trazabilidad
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch />
                            <HelpTooltip content="Te alertamos cuando se detectan problemas en la trazabilidad" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>Guardar Preferencias</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Usuarios Tab */}
            <TabsContent value="usuarios">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-primary" />
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <HelpTooltip content="Administra los usuarios que tienen acceso a BeLoop" />
                  </div>
                  <CardDescription>
                    Administra usuarios y permisos en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Button>Añadir Nuevo Usuario</Button>
                      <HelpTooltip content="Crea nuevas cuentas de usuario con roles específicos" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      El sistema cuenta actualmente con 12 usuarios activos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Integraciones Tab */}
            <TabsContent value="integraciones">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Integraciones con Sistemas Externos</CardTitle>
                    <HelpTooltip content="Conecta BeLoop con otros sistemas y plataformas" />
                  </div>
                  <CardDescription>
                    Conecta con sistemas externos para mejorar la trazabilidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium">SAP ERP</h4>
                            <HelpTooltip content="Conecta con SAP para datos de inventario y productos" />
                          </div>
                          <p className="text-sm text-muted-foreground">Integración con datos de inventario y producción</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 mr-3">Conectado</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium">Certificación ISO 14001</h4>
                            <HelpTooltip content="Integración con plataforma de gestión ambiental ISO" />
                          </div>
                          <p className="text-sm text-muted-foreground">Integración con plataforma de gestión ambiental</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 mr-3">Conectado</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16.5c0 .83-.67 1.5-1.5 1.5H8v-3h11.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium">Plataforma de Blockchain</h4>
                            <HelpTooltip content="Permite trazabilidad inmutable de productos mediante blockchain" />
                          </div>
                          <p className="text-sm text-muted-foreground">Trazabilidad avanzada mediante blockchain</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-amber-600 mr-3">Configuración pendiente</span>
                        <Button variant="outline" size="sm">Configurar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* DataLake Tab */}
            <TabsContent value="datalake">
              <DataLakeIntegration />
            </TabsContent>
            
            {/* Normativas Tab */}
            <TabsContent value="normativas">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>Normativas y Regulaciones</CardTitle>
                    <HelpTooltip content="Gestiona el cumplimiento de normativas clave" />
                  </div>
                  <CardDescription>
                    Gestiona el cumplimiento normativo relacionado con el ciclo de vida del producto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-md">
                      <div className="p-4 border-b bg-muted/50">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Ley de Responsabilidad Extendida del Productor (REP)</h3>
                          <HelpTooltip content="Normativa que obliga a los productores a gestionar sus productos al final de su vida útil" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Marco legal para la gestión de residuos y responsabilidad post-consumo
                        </p>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Activar seguimiento de cumplimiento</p>
                              <p className="text-sm text-muted-foreground">
                                Monitoreo automático de requisitos y plazos
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch defaultChecked />
                              <HelpTooltip content="Activa alertas y seguimiento automático de cumplimiento" />
                            </div>
                          </div>
                          
                          <div className="bg-green-50 p-3 rounded-md border border-green-200 text-sm">
                            <p className="text-green-800 font-medium">Estado de cumplimiento: Al día</p>
                            <p className="text-green-700 text-xs mt-1">
                              La última declaración fue presentada el 15/03/2025
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md">
                      <div className="p-4 border-b bg-muted/50">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Huella de Carbono y Reportes de Sostenibilidad</h3>
                          <HelpTooltip content="Requisitos de medición y reporte de impacto ambiental" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Requisitos para informes de emisiones y sostenibilidad
                        </p>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Activar cálculo automático</p>
                              <p className="text-sm text-muted-foreground">
                                Estimación periódica de la huella de carbono
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch defaultChecked />
                              <HelpTooltip content="Calcula automáticamente la huella de carbono según los datos disponibles" />
                            </div>
                          </div>
                          
                          <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm">
                            <p className="text-amber-800 font-medium">Próximo reporte: 30/05/2025</p>
                            <p className="text-amber-700 text-xs mt-1">
                              45 días restantes para la presentación del informe anual
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Planes Tab */}
            <TabsContent value="planes">
              <SettingsTabPlans />
            </TabsContent>
          </Tabs>
        </div>
        
        <Footer />
        <VideoTutorialButton 
          title="Tutorial: Configuración del Perfil" 
          description="Aprende a configurar tu perfil y personalizar las opciones de BeLoop según tus necesidades."
        />
        <GlobalSearch />
        <ChatAssistant />
      </div>
    </div>
  );
};

export default Settings;
