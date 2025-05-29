import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import HelpTooltip from "@/components/HelpTooltip";

const SettingsTabPlans = () => {
  return (
    <Tabs defaultValue="planes">
      <TabsList className="mb-4">
        <TabsTrigger value="planes">Planes</TabsTrigger>
        <TabsTrigger value="facturacion">Facturación</TabsTrigger>
        <TabsTrigger value="metodo-pago">Método de pago</TabsTrigger>
      </TabsList>

      {/* Planes Tab */}
      <TabsContent value="planes">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BeLoopIcon name="zap" className="h-5 w-5 text-primary" />
                <CardTitle>Plan de Suscripción</CardTitle>
                <HelpTooltip content="Gestiona tu plan de suscripción y opciones disponibles" />
              </div>
            </div>
            <CardDescription>
              Gestiona tu plan de suscripción y opciones de facturación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="border rounded-md">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Plan Actual: Premium</h3>
                    <HelpTooltip content="Tu plan actual con todas sus características" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Acceso completo a todas las funcionalidades
                  </p>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Ciclo de facturación</p>
                        <p className="text-sm text-muted-foreground">
                          Facturación anual con renovación automática
                        </p>
                      </div>
                      <Button variant="outline">Cambiar Plan</Button>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-md border border-green-200 text-sm">
                      <p className="text-green-800 font-medium">Estado: Activo</p>
                      <p className="text-green-700 text-xs mt-1">
                        Próxima renovación: 15/08/2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Plan Features */}
              <div className="border rounded-md">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Características del Plan Premium</h3>
                    <HelpTooltip content="Funcionalidades incluidas en tu plan actual" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Beneficios incluidos en tu suscripción actual
                  </p>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Usuarios ilimitados</p>
                        <p className="text-sm text-muted-foreground">Sin restricciones en el número de cuentas</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Almacenamiento: 500GB</p>
                        <p className="text-sm text-muted-foreground">Para documentos, imágenes y archivos</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">API ilimitada</p>
                        <p className="text-sm text-muted-foreground">Sin límites en llamadas a la API</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Soporte prioritario 24/7</p>
                        <p className="text-sm text-muted-foreground">Asistencia técnica preferente</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Available Plans */}
              <div className="border rounded-md">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Planes disponibles</h3>
                    <HelpTooltip content="Comparativa de planes y precios disponibles" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Otros planes y opciones de contratación
                  </p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="font-medium mb-2">Básico</div>
                      <div className="text-2xl font-bold mb-2">€99<span className="text-sm font-normal text-muted-foreground">/mes</span></div>
                      <p className="text-sm text-muted-foreground mb-4">Para pequeñas empresas iniciando en economía circular</p>
                      <Button variant="outline" className="w-full">Ver detalles</Button>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-primary/5 border-primary/30 relative">
                      <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-md">
                        Actual
                      </div>
                      <div className="font-medium mb-2">Premium</div>
                      <div className="text-2xl font-bold mb-2">€299<span className="text-sm font-normal text-muted-foreground">/mes</span></div>
                      <p className="text-sm text-muted-foreground mb-4">Para empresas con necesidades avanzadas de gestión</p>
                      <Button className="w-full">Mantener plan</Button>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="font-medium mb-2">Empresarial</div>
                      <div className="text-2xl font-bold mb-2">Personalizado</div>
                      <p className="text-sm text-muted-foreground mb-4">Soluciones a medida para grandes corporaciones</p>
                      <Button variant="outline" className="w-full">Contactar</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Facturación Tab */}
      <TabsContent value="facturacion">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BeLoopIcon name="fileText" className="h-5 w-5 text-primary" />
                <CardTitle>Historial de Facturación</CardTitle>
                <HelpTooltip content="Consulta el historial de facturas y pagos de tu cuenta" />
              </div>
            </div>
            <CardDescription>
              Registro de facturas y pagos anteriores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Billing History */}
              <div className="border rounded-md">
                <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Facturas recientes</h3>
                    <HelpTooltip content="Últimas facturas emitidas para tu cuenta" />
                  </div>
                  <Button variant="outline" size="sm">Exportar historial</Button>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-medium">15/08/2024</p>
                        <p className="text-sm text-muted-foreground">Plan Premium - Anual</p>
                        <p className="text-xs text-muted-foreground">Factura #INV-2024-0158</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€3,600.00</p>
                        <div className="flex gap-2 mt-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <BeLoopIcon name="fileText" size={12} className="mr-1" />
                            Ver
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                            <BeLoopIcon name="download" size={12} className="mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-medium">15/08/2023</p>
                        <p className="text-sm text-muted-foreground">Plan Estándar - Anual</p>
                        <p className="text-xs text-muted-foreground">Factura #INV-2023-0142</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€1,800.00</p>
                        <div className="flex gap-2 mt-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <BeLoopIcon name="fileText" size={12} className="mr-1" />
                            Ver
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                            <BeLoopIcon name="download" size={12} className="mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-medium">15/08/2022</p>
                        <p className="text-sm text-muted-foreground">Plan Básico - Anual</p>
                        <p className="text-xs text-muted-foreground">Factura #INV-2022-0098</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€1,200.00</p>
                        <div className="flex gap-2 mt-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <BeLoopIcon name="fileText" size={12} className="mr-1" />
                            Ver
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                            <BeLoopIcon name="download" size={12} className="mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Billing Settings */}
              <div className="border rounded-md">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Configuración de facturación</h3>
                    <HelpTooltip content="Configura tus preferencias de facturación" />
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre fiscal</Label>
                      <Input defaultValue="BASF Española S.L." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>NIF/CIF</Label>
                      <Input defaultValue="B-08200388" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Dirección fiscal</Label>
                    <Input defaultValue="Carrer de Tarragona, 161, 08014 Barcelona" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>País</Label>
                      <Input defaultValue="España" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Código postal</Label>
                      <Input defaultValue="08014" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email para facturas</Label>
                      <Input defaultValue="facturacion@basf.com" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button>Guardar cambios</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Método de pago Tab */}
      <TabsContent value="metodo-pago">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BeLoopIcon name="creditCard" className="h-5 w-5 text-primary" />
                <CardTitle>Métodos de Pago</CardTitle>
                <HelpTooltip content="Gestiona tus métodos de pago y configuración de cobros" />
              </div>
            </div>
            <CardDescription>
              Administra las formas de pago para tu suscripción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Current Payment Method */}
              <div className="border rounded-md">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Método de pago actual</h3>
                    <HelpTooltip content="Método de pago actualmente configurado" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.2" />
                          <path d="M20 8H4V6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V8Z" fill="currentColor" />
                          <path d="M4 10V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V10H4Z" fill="currentColor" fillOpacity="0.6" />
                          <path d="M7 15H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Visa terminada en 4589</p>
                        <p className="text-sm text-muted-foreground">Expira: 09/26</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="outline" size="sm">Eliminar</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add New Payment Method */}
              <div className="border rounded-md">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Añadir nueva forma de pago</h3>
                    <HelpTooltip content="Añade un nuevo método de pago a tu cuenta" />
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Número de tarjeta</Label>
                      <Input placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha de expiración</Label>
                        <Input placeholder="MM/AA" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Código de seguridad (CVC)</Label>
                        <Input placeholder="CVC" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Nombre en la tarjeta</Label>
                      <Input placeholder="Nombre como aparece en la tarjeta" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm flex items-center gap-1 text-muted-foreground">
                      <BeLoopIcon name="lock" size={14} />
                      <span>Conexión segura</span>
                    </div>
                    <Button>Añadir método de pago</Button>
                  </div>
                </div>
              </div>
              
              {/* Other Payment Options */}
              <div className="border rounded-md">
                <div className="p-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Otras opciones de pago</h3>
                    <HelpTooltip content="Métodos alternativos de pago disponibles" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                            <path d="M6 12H18M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Transferencia bancaria</p>
                          <p className="text-xs text-muted-foreground">Pago manual mediante transferencia</p>
                        </div>
                      </div>
                      <BeLoopIcon name="arrowRight" size={16} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none">
                            <path d="M19 11H5M19 11C19.5304 11 20.0391 11.2107 20.4142 11.5858C20.7893 11.9609 21 12.4696 21 13V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V13C3 12.4696 3.21071 11.9609 3.58579 11.5858C3.96086 11.2107 4.46957 11 5 11M19 11V9C19 8.46957 18.7893 7.96086 18.4142 7.58579C18.0391 7.21071 17.5304 7 17 7M5 11V9C5 8.46957 5.21071 7.96086 5.58579 7.58579C5.96086 7.21071 6.46957 7 7 7M17 7V5C17 4.46957 16.7893 3.96086 16.4142 3.58579C16.0391 3.21071 15.5304 3 15 3H9C8.46957 3 7.96086 3.21071 7.58579 3.58579C7.21071 3.96086 7 4.46957 7 5V7M17 7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Solicitar factura</p>
                          <p className="text-xs text-muted-foreground">Para pagos mediante departamento financiero</p>
                        </div>
                      </div>
                      <BeLoopIcon name="arrowRight" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabPlans;
