
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import BeLoopIcon from '@/components/BeLoopIcons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Compliance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState("auditorias");
  const [activeLifecycle, setActiveLifecycle] = useState("planificacion");

  // Datos de ejemplo para el dashboard
  const upcomingEvents = [
    { id: 1, title: 'Auditoría ISO 9001', date: '2025-05-15', type: 'Auditoría formal', progress: 75 },
    { id: 2, title: 'Visita de OSHA', date: '2025-05-25', type: 'Visita de autoridades', progress: 40 },
    { id: 3, title: 'Revisión de Sistema de Gestión', date: '2025-06-10', type: 'Visita de sistemas de gestión', progress: 25 },
  ];

  // Datos para categorización
  const auditoriasList = [
    { id: 1, title: 'Auditoría ISO 9001', date: '2025-05-15', status: 'Programada' },
    { id: 2, title: 'Auditoría ISO 14001', date: '2025-07-10', status: 'Planificación' },
    { id: 3, title: 'Auditoría ISO 45001', date: '2025-08-22', status: 'Pendiente' },
  ];
  
  const autoridadesList = [
    { id: 1, title: 'Visita de OSHA', date: '2025-05-25', status: 'Confirmada' },
    { id: 2, title: 'Inspección Sanitaria', date: '2025-06-18', status: 'Programada' },
  ];
  
  const sistemasList = [
    { id: 1, title: 'Revisión de Sistema de Calidad', date: '2025-06-10', status: 'Programada' },
    { id: 2, title: 'Evaluación de Procesos', date: '2025-07-05', status: 'Pendiente' },
  ];
  
  const consultativasList = [
    { id: 1, title: 'Asesoría en Normalización', date: '2025-05-30', status: 'Confirmada' },
    { id: 2, title: 'Consultoría de Mejora', date: '2025-06-22', status: 'Programada' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Centro de Verificación y Cumplimiento</h1>
              <p className="text-muted-foreground">Gestión de verificación y cumplimiento normativo</p>
            </div>
          </div>
          
          {/* Pestañas principales */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="categorias">Categorización</TabsTrigger>
              <TabsTrigger value="ciclo">Ciclo de vida</TabsTrigger>
            </TabsList>

            {/* CONTENIDO: DASHBOARD */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Calendario visual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="calendar" className="mr-2" />
                    Calendario de eventos
                  </CardTitle>
                  <CardDescription>Vista de eventos programados para verificación y auditorías</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="border rounded-md"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-medium">Eventos próximos</h3>
                    {upcomingEvents.map((event) => (
                      <Card key={event.id} className="mb-4">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{event.title}</CardTitle>
                            <Badge>{event.type}</Badge>
                          </div>
                          <CardDescription>{event.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Preparación</span>
                              <span>{event.progress}%</span>
                            </div>
                            <Progress value={event.progress} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Indicadores de preparación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="gauge" className="mr-2" />
                    Indicadores de preparación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-1">Documentos listos</p>
                        <p className="text-3xl font-bold">85%</p>
                        <Progress value={85} className="h-2 mt-2 w-full" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-1">Personal capacitado</p>
                        <p className="text-3xl font-bold">70%</p>
                        <Progress value={70} className="h-2 mt-2 w-full" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-1">Acond. de instalaciones</p>
                        <p className="text-3xl font-bold">90%</p>
                        <Progress value={90} className="h-2 mt-2 w-full" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-1">Procesos verificados</p>
                        <p className="text-3xl font-bold">65%</p>
                        <Progress value={65} className="h-2 mt-2 w-full" />
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              {/* Alertas de proximidad */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="bell" className="mr-2" />
                    Alertas de proximidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-red-50 text-red-700 border-red-200">
                    <BeLoopIcon name="bell" className="h-4 w-4" />
                    <AlertTitle>Auditoría ISO 9001</AlertTitle>
                    <AlertDescription>
                      Esta auditoría está programada para dentro de 10 días. La documentación está al 75% de preparación.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-amber-50 text-amber-700 border-amber-200">
                    <BeLoopIcon name="bell" className="h-4 w-4" />
                    <AlertTitle>Visita de OSHA</AlertTitle>
                    <AlertDescription>
                      Esta visita está programada para dentro de 20 días. La preparación está al 40%.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                    <BeLoopIcon name="bell" className="h-4 w-4" />
                    <AlertTitle>Revisión de Sistema de Gestión</AlertTitle>
                    <AlertDescription>
                      Esta revisión está programada para dentro de 36 días. La preparación está al 25%.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* CONTENIDO: CATEGORIZACIÓN */}
            <TabsContent value="categorias">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="fileText" className="mr-2" />
                    Categorización por tipo
                  </CardTitle>
                  <CardDescription>Gestión de los diferentes tipos de verificaciones y auditorías</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                    <TabsList className="grid grid-cols-4 mb-6">
                      <TabsTrigger value="auditorias">Auditorías formales</TabsTrigger>
                      <TabsTrigger value="autoridades">Visitas de autoridades</TabsTrigger>
                      <TabsTrigger value="sistemas">Visitas de sistemas de gestión</TabsTrigger>
                      <TabsTrigger value="consultativas">Visitas consultivas</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="auditorias">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Auditoría</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {auditoriasList.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="autoridades">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Visita</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {autoridadesList.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="sistemas">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Visita</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sistemasList.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="consultativas">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Visita</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {consultativasList.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* CONTENIDO: CICLO DE VIDA */}
            <TabsContent value="ciclo">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="lifecycle" className="mr-2" />
                    Ciclo de vida completo
                  </CardTitle>
                  <CardDescription>Seguimiento del ciclo de vida de auditorías y verificaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeLifecycle} onValueChange={setActiveLifecycle}>
                    <TabsList className="grid grid-cols-4 mb-6">
                      <TabsTrigger value="planificacion">Planificación y preparación</TabsTrigger>
                      <TabsTrigger value="ejecucion">Ejecución y documentación</TabsTrigger>
                      <TabsTrigger value="seguimiento">Seguimiento de hallazgos</TabsTrigger>
                      <TabsTrigger value="cierre">Cierre y lecciones</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="planificacion">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <BeLoopIcon name="fileCheck" size={16} className="mr-2" />
                                Auditoría ISO 9001
                              </CardTitle>
                              <CardDescription>15/05/2025</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">Documentación</span>
                                  <span className="text-sm">75%</span>
                                </div>
                                <Progress value={75} className="h-2" />
                                
                                <div className="flex justify-between">
                                  <span className="text-sm">Capacitación</span>
                                  <span className="text-sm">60%</span>
                                </div>
                                <Progress value={60} className="h-2" />
                                
                                <div className="flex justify-between">
                                  <span className="text-sm">Instalaciones</span>
                                  <span className="text-sm">85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <BeLoopIcon name="fileCheck" size={16} className="mr-2" />
                                Visita de OSHA
                              </CardTitle>
                              <CardDescription>25/05/2025</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">Documentación</span>
                                  <span className="text-sm">40%</span>
                                </div>
                                <Progress value={40} className="h-2" />
                                
                                <div className="flex justify-between">
                                  <span className="text-sm">Capacitación</span>
                                  <span className="text-sm">30%</span>
                                </div>
                                <Progress value={30} className="h-2" />
                                
                                <div className="flex justify-between">
                                  <span className="text-sm">Instalaciones</span>
                                  <span className="text-sm">50%</span>
                                </div>
                                <Progress value={50} className="h-2" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="ejecucion">
                      <div className="space-y-4">
                        <Collapsible className="border rounded-md p-4">
                          <CollapsibleTrigger className="flex w-full justify-between items-center">
                            <div className="flex items-center">
                              <BeLoopIcon name="filePen" size={16} className="mr-2" />
                              <span>Auditoría ISO 14001 (En proceso)</span>
                            </div>
                            <BeLoopIcon name="chevronDown" size={16} />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-4">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">La auditoría se encuentra actualmente en ejecución. Los auditores están revisando la documentación del sistema de gestión ambiental.</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Actividades completadas</h4>
                                  <ul className="text-sm space-y-1">
                                    <li className="flex items-center">
                                      <BeLoopIcon name="checkCircle" size={14} className="mr-2 text-green-500" />
                                      <span>Reunión de apertura</span>
                                    </li>
                                    <li className="flex items-center">
                                      <BeLoopIcon name="checkCircle" size={14} className="mr-2 text-green-500" />
                                      <span>Revisión de política ambiental</span>
                                    </li>
                                    <li className="flex items-center">
                                      <BeLoopIcon name="checkCircle" size={14} className="mr-2 text-green-500" />
                                      <span>Entrevista con responsables</span>
                                    </li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Próximas actividades</h4>
                                  <ul className="text-sm space-y-1">
                                    <li className="flex items-center">
                                      <BeLoopIcon name="clock" size={14} className="mr-2 text-amber-500" />
                                      <span>Revisión de procedimientos</span>
                                    </li>
                                    <li className="flex items-center">
                                      <BeLoopIcon name="clock" size={14} className="mr-2 text-amber-500" />
                                      <span>Inspección de instalaciones</span>
                                    </li>
                                    <li className="flex items-center">
                                      <BeLoopIcon name="clock" size={14} className="mr-2 text-amber-500" />
                                      <span>Reunión de cierre</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        
                        <Collapsible className="border rounded-md p-4">
                          <CollapsibleTrigger className="flex w-full justify-between items-center">
                            <div className="flex items-center">
                              <BeLoopIcon name="filePen" size={16} className="mr-2" />
                              <span>Inspección de Instalaciones (Programada)</span>
                            </div>
                            <BeLoopIcon name="chevronDown" size={16} />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-4">
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">La inspección de instalaciones se realizará el 15/06/2025. Se revisarán las áreas de producción, almacenamiento y gestión de residuos.</p>
                              <div className="grid grid-cols-1 gap-2">
                                <h4 className="text-sm font-medium">Documentación necesaria:</h4>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-center">
                                    <BeLoopIcon name="file" size={14} className="mr-2 text-blue-500" />
                                    <span>Planos de instalaciones</span>
                                  </li>
                                  <li className="flex items-center">
                                    <BeLoopIcon name="file" size={14} className="mr-2 text-blue-500" />
                                    <span>Registros de mantenimiento</span>
                                  </li>
                                  <li className="flex items-center">
                                    <BeLoopIcon name="file" size={14} className="mr-2 text-blue-500" />
                                    <span>Documentación de seguridad</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="seguimiento">
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base flex items-center">
                                <BeLoopIcon name="fileSearch" size={16} className="mr-2" />
                                Seguimiento de hallazgos: ISO 9001
                              </CardTitle>
                              <Badge>En progreso</Badge>
                            </div>
                            <CardDescription>Última actualización: 01/05/2025</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Hallazgo</TableHead>
                                  <TableHead>Severidad</TableHead>
                                  <TableHead>Estado</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">Falta de registros de capacitación</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Media</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resuelto</Badge>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Procedimiento desactualizado</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Media</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En proceso</Badge>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">Control de documentos inadecuado</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Alta</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En proceso</Badge>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-base flex items-center">
                                <BeLoopIcon name="fileSearch" size={16} className="mr-2" />
                                Seguimiento de hallazgos: Visita OSHA
                              </CardTitle>
                              <Badge>Planificado</Badge>
                            </div>
                            <CardDescription>Fecha de visita: 25/05/2025</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="p-4 text-center text-muted-foreground">
                              <p>La visita aún no se ha realizado. Los hallazgos se registrarán aquí después del evento.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="cierre">
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center">
                              <BeLoopIcon name="fileX" size={16} className="mr-2" />
                              Auditoría ISO 9001 (2024)
                            </CardTitle>
                            <CardDescription>Finalizada: 10/11/2024</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Resumen de resultados</h4>
                                <p className="text-sm text-muted-foreground">Se completó la auditoría con 5 hallazgos menores y 1 mayor. Todos los hallazgos fueron resueltos satisfactoriamente.</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Lecciones aprendidas</h4>
                                <ul className="text-sm space-y-2">
                                  <li className="flex items-start">
                                    <BeLoopIcon name="checkCircle" size={16} className="mr-2 text-green-500 mt-0.5" />
                                    <span>Mejorar la preparación documental con al menos 1 mes de anticipación</span>
                                  </li>
                                  <li className="flex items-start">
                                    <BeLoopIcon name="checkCircle" size={16} className="mr-2 text-green-500 mt-0.5" />
                                    <span>Realizar más simulacros de auditoría para el personal clave</span>
                                  </li>
                                  <li className="flex items-start">
                                    <BeLoopIcon name="checkCircle" size={16} className="mr-2 text-green-500 mt-0.5" />
                                    <span>Establecer un proceso más eficiente para la gestión de no conformidades</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="bg-muted/50 p-4 rounded-md">
                                <h4 className="font-medium mb-2">Acciones de mejora implementadas</h4>
                                <ul className="text-sm space-y-2">
                                  <li className="flex items-start">
                                    <BeLoopIcon name="checkCircle" size={16} className="mr-2 text-green-500 mt-0.5" />
                                    <span>Actualización del sistema de gestión documental</span>
                                  </li>
                                  <li className="flex items-start">
                                    <BeLoopIcon name="checkCircle" size={16} className="mr-2 text-green-500 mt-0.5" />
                                    <span>Programa de capacitación continua para personal clave</span>
                                  </li>
                                  <li className="flex items-start">
                                    <BeLoopIcon name="checkCircle" size={16} className="mr-2 text-green-500 mt-0.5" />
                                    <span>Mejora en el seguimiento de indicadores de calidad</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center">
                              <BeLoopIcon name="fileX" size={16} className="mr-2" />
                              Visita de Inspección Ambiental
                            </CardTitle>
                            <CardDescription>Finalizada: 05/03/2025</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Resumen de resultados</h4>
                                <p className="text-sm text-muted-foreground">La inspección culminó satisfactoriamente con 3 observaciones menores que fueron atendidas en el plazo establecido.</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Lecciones aprendidas</h4>
                                <ul className="text-sm space-y-2">
                                  <li className="flex items-start">
                                    <BeLoopIcon name="checkCircle" size={16} className="mr-2 text-green-500 mt-0.5" />
                                    <span>Mantener registros actualizados de gestión de residuos</span>
                                  </li>
                                  <li className="flex items-start">
                                    <BeLoopIcon name="checkCircle" size={16} className="mr-2 text-green-500 mt-0.5" />
                                    <span>Realizar verificaciones periódicas de cumplimiento ambiental</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
