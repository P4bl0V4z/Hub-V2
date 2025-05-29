
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from '@/components/Sidebar';
import BeLoopIcon from '@/components/BeLoopIcons';

const Academy = () => {
  const [activeTab, setActiveTab] = useState("cursos");
  
  // Course data
  const courses = [
    { 
      id: 1, 
      title: "Fundamentos de Economía Circular", 
      description: "Conceptos básicos y principios fundamentales de la Economía Circular", 
      level: "Básico",
      duration: "4 horas",
      progress: 100,
      status: "Completado",
      image: "circular-economy"
    },
    { 
      id: 2, 
      title: "Introducción a la Ley REP", 
      description: "Marco legal y normativo de la Responsabilidad Extendida del Productor", 
      level: "Básico",
      duration: "3 horas",
      progress: 75,
      status: "En progreso",
      image: "rep-law"
    },
    { 
      id: 3, 
      title: "Análisis de Ciclo de Vida de Productos", 
      description: "Metodologías para evaluar impactos ambientales en todo el ciclo de vida", 
      level: "Intermedio",
      duration: "6 horas",
      progress: 0,
      status: "No iniciado",
      image: "lifecycle"
    },
    { 
      id: 4, 
      title: "Pasaportes Digitales de Producto", 
      description: "Implementación y gestión de pasaportes digitales para trazabilidad", 
      level: "Avanzado",
      duration: "5 horas",
      progress: 0,
      status: "No iniciado",
      image: "digital-passport"
    },
  ];

  // Workshop data
  const workshops = [
    {
      id: 1,
      title: "Taller de Ecodiseño",
      description: "Aplicación de criterios de sostenibilidad en diseño de productos",
      date: "15/06/2025",
      time: "10:00 - 13:00",
      location: "Virtual",
      spots: "15/20 disponibles",
      instructor: "Ana Medina"
    },
    {
      id: 2,
      title: "Medición de Huella de Carbono",
      description: "Métodos y herramientas para calcular la huella de carbono corporativa",
      date: "22/06/2025",
      time: "15:00 - 17:30",
      location: "Virtual",
      spots: "8/15 disponibles",
      instructor: "Carlos Fuentes"
    },
    {
      id: 3,
      title: "Cumplimiento REP para Envases y Embalajes",
      description: "Aspectos prácticos para cumplir con las normativas actuales",
      date: "30/06/2025",
      time: "09:00 - 12:00",
      location: "Presencial",
      spots: "12/25 disponibles",
      instructor: "Daniela Moreno"
    }
  ];

  // Events data
  const events = [
    {
      id: 1,
      title: "Webinar: Tendencias Globales en Economía Circular",
      speaker: "Dr. Miguel Sánchez",
      date: "18/06/2025",
      time: "16:00 - 17:30",
      type: "Webinar",
      registered: true
    },
    {
      id: 2,
      title: "Conferencia: Implementación de la Ley REP en Latinoamérica",
      speaker: "Panel de Expertos",
      date: "25/06/2025",
      time: "10:00 - 12:00",
      type: "Conferencia",
      registered: false
    },
    {
      id: 3,
      title: "Mesa Redonda: Desafíos y Oportunidades en la Transición Circular",
      speaker: "Múltiples Expositores",
      date: "10/07/2025",
      time: "14:00 - 16:30",
      type: "Mesa Redonda",
      registered: false
    }
  ];

  // Glossary data
  const glossaryTerms = [
    {
      term: "Economía Circular",
      definition: "Modelo económico que busca mantener los productos, materiales y recursos en la economía durante el mayor tiempo posible, reduciendo al mínimo la generación de residuos."
    },
    {
      term: "Responsabilidad Extendida del Productor (REP)",
      definition: "Estrategia de gestión ambiental que extiende la responsabilidad de los productores sobre sus productos a lo largo de todo su ciclo de vida, especialmente en la etapa post-consumo."
    },
    {
      term: "Análisis de Ciclo de Vida (ACV)",
      definition: "Metodología que evalúa los impactos ambientales asociados con todas las etapas de la vida de un producto, desde la extracción de materias primas hasta su disposición final."
    },
    {
      term: "Ecodiseño",
      definition: "Integración de aspectos ambientales en el diseño del producto con el objetivo de mejorar su desempeño ambiental a lo largo de su ciclo de vida."
    },
    {
      term: "Pasaporte Digital de Producto",
      definition: "Registro digital que contiene información sobre los componentes, materiales, químicos y posibilidades de reparación y desmontaje de un producto."
    },
    {
      term: "Sistema de Gestión",
      definition: "Organización que cumple los requisitos establecidos en la normativa REP, encargada de gestionar los residuos de los productos prioritarios."
    }
  ];

  // Certification data
  const certifications = [
    {
      id: 1,
      title: "Especialista en Economía Circular",
      level: "Profesional",
      duration: "40 horas",
      modules: 5,
      requirements: "Curso básico completado",
      price: "$650"
    },
    {
      id: 2,
      title: "Implementador de Sistemas REP",
      level: "Avanzado",
      duration: "60 horas",
      modules: 8,
      requirements: "Conocimientos previos en normativa ambiental",
      price: "$890"
    },
    {
      id: 3,
      title: "Analista de Ciclo de Vida",
      level: "Experto",
      duration: "80 horas",
      modules: 10,
      requirements: "Certificado de especialista",
      price: "$1,200"
    }
  ];

  // Reports data
  const reports = [
    { id: 1, title: "Análisis de Progreso Formativo", date: "05/05/2025", format: "PDF", size: "1.2 MB" },
    { id: 2, title: "Certificaciones Completadas", date: "01/05/2025", format: "PDF", size: "0.8 MB" },
    { id: 3, title: "Resumen de Actividad", date: "30/04/2025", format: "XLSX", size: "2.1 MB" },
  ];

  // Data Center information
  const dataStats = [
    { label: "Emisiones globales CO2 del sector plástico", value: "1.8 billones de toneladas", change: "+3.4%", year: "2024" },
    { label: "Tasa de reciclaje global", value: "9%", change: "+1.2%", year: "2024" },
    { label: "Empresas con compromisos de circularidad", value: "2,345", change: "+15%", year: "2024" },
    { label: "Valor económico de la economía circular", value: "$4.5 trillones", change: "+8.3%", year: "2025 (proyección)" },
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
              <h1 className="text-3xl font-bold mb-1">Academia</h1>
              <p className="text-muted-foreground">Recursos de aprendizaje y formación</p>
            </div>
          </div>
          
          <Tabs defaultValue="cursos" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 md:grid-cols-7">
              <TabsTrigger value="cursos">Cursos</TabsTrigger>
              <TabsTrigger value="workshops">Workshops</TabsTrigger>
              <TabsTrigger value="eventos">Eventos en vivo</TabsTrigger>
              <TabsTrigger value="reportes">Reportes</TabsTrigger>
              <TabsTrigger value="glosario">Glosario</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="certificaciones">Certificaciones</TabsTrigger>
            </TabsList>
            
            {/* CURSOS */}
            <TabsContent value="cursos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="book" size={20} className="mr-2" />
                    Cursos Disponibles
                  </CardTitle>
                  <CardDescription>
                    Aprenda a su propio ritmo con nuestros cursos online sobre economía circular y gestión ambiental
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {courses.map((course) => (
                      <Card key={course.id} className="overflow-hidden">
                        <div className="bg-muted/30 p-4 h-36 flex items-center justify-center">
                          <BeLoopIcon name={course.image === "circular-economy" ? "recycling" : 
                                            course.image === "rep-law" ? "fileCheck" : 
                                            course.image === "lifecycle" ? "recycling" : "shield"} 
                                      size={48} className="text-primary/70" />
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">{course.title}</CardTitle>
                          <CardDescription className="line-clamp-2 h-10">{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <BeLoopIcon name="barChart" size={14} />
                              {course.level}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <BeLoopIcon name="clock" size={14} />
                              {course.duration}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mb-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex items-center justify-between">
                          <Badge variant={course.status === "Completado" ? "default" : 
                                          course.status === "En progreso" ? "secondary" : "outline"}>
                            {course.status}
                          </Badge>
                          <Button size="sm">
                            {course.progress > 0 ? "Continuar" : "Comenzar"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" className="flex items-center gap-2">
                    <BeLoopIcon name="filter" size={16} />
                    Filtrar
                  </Button>
                  <Button className="flex items-center gap-2">
                    <BeLoopIcon name="plus" size={16} />
                    Ver todos los cursos
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* WORKSHOPS */}
            <TabsContent value="workshops">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="users" size={20} className="mr-2" />
                    Workshops y Talleres
                  </CardTitle>
                  <CardDescription>
                    Sesiones prácticas para mejorar sus habilidades en temas de sostenibilidad y economía circular
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workshops.map((workshop) => (
                      <Card key={workshop.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-muted/30 p-6 flex items-center justify-center md:w-1/5">
                            <BeLoopIcon name="users" size={40} className="text-primary/70" />
                          </div>
                          <div className="p-6 md:w-4/5">
                            <h3 className="text-lg font-medium mb-1">{workshop.title}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{workshop.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <BeLoopIcon name="calendar" size={16} className="text-muted-foreground" />
                                <span className="text-sm">{workshop.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BeLoopIcon name="clock" size={16} className="text-muted-foreground" />
                                <span className="text-sm">{workshop.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BeLoopIcon name={workshop.location === "Virtual" ? "monitor" : "mapPin"} size={16} className="text-muted-foreground" />
                                <span className="text-sm">{workshop.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <BeLoopIcon name="user" size={14} />
                                  {workshop.spots}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Instructor: {workshop.instructor}
                                </span>
                              </div>
                              <Button>Inscribirse</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button className="flex items-center gap-2">
                    <BeLoopIcon name="plus" size={16} />
                    Ver todos los workshops
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* EVENTOS */}
            <TabsContent value="eventos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="calendar" size={20} className="mr-2" />
                    Eventos en Vivo
                  </CardTitle>
                  <CardDescription>
                    Webinars y conferencias para mantenerse actualizado en tendencias y normativas del sector
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {events.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="bg-muted/30 p-4 h-24 flex items-center justify-center">
                          <BeLoopIcon 
                            name={event.type === "Webinar" ? "video" : 
                                  event.type === "Conferencia" ? "microphoneStage" : "users"} 
                            size={32} 
                            className="text-primary/70" 
                          />
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <Badge className="mb-2 w-fit" variant="outline">{event.type}</Badge>
                          <CardTitle className="text-base">{event.title}</CardTitle>
                          <CardDescription>Ponente: {event.speaker}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <BeLoopIcon name="calendar" size={14} />
                              {event.date}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <BeLoopIcon name="clock" size={14} />
                              {event.time}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex items-center justify-between">
                          {event.registered ? (
                            <Badge variant="default">Inscrito</Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">Plazas limitadas</span>
                          )}
                          <Button size="sm" variant={event.registered ? "outline" : "default"}>
                            {event.registered ? "Ver detalles" : "Inscribirse"}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" className="flex items-center gap-2">
                    <BeLoopIcon name="calendarRange" size={16} />
                    Ver calendario
                  </Button>
                  <Button className="flex items-center gap-2">
                    <BeLoopIcon name="plus" size={16} />
                    Ver todos los eventos
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* REPORTES */}
            <TabsContent value="reportes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="fileText" size={20} className="mr-2" />
                    Reportes de Progreso
                  </CardTitle>
                  <CardDescription>
                    Seguimiento de su formación y certificaciones en BeLoop Academy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Progreso Global</CardTitle>
                          <CardDescription>Cursos y certificaciones</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold mb-2">65%</div>
                          <div className="w-full bg-muted rounded-full h-3 mb-2">
                            <div className="bg-primary h-3 rounded-full" style={{ width: "65%" }}></div>
                          </div>
                          <div className="text-sm text-muted-foreground">2 de 4 cursos completados</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Horas de Formación</CardTitle>
                          <CardDescription>Total acumulado</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold mb-2">18h</div>
                          <div className="text-sm text-muted-foreground">+4h desde el último mes</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Certificados</CardTitle>
                          <CardDescription>Credenciales obtenidas</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold mb-2">1</div>
                          <div className="text-sm text-muted-foreground">Especialista en Economía Circular</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Reportes disponibles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y">
                          {reports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between py-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-muted/50">
                                  <BeLoopIcon name="fileText" size={16} className="text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{report.title}</p>
                                  <p className="text-xs text-muted-foreground">{report.date} · {report.size}</p>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost">
                                <BeLoopIcon name="download" size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* GLOSARIO */}
            <TabsContent value="glosario">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="bookOpen" size={20} className="mr-2" />
                    Glosario Técnico
                  </CardTitle>
                  <CardDescription>
                    Términos y definiciones relacionados con economía circular y sostenibilidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative">
                      <BeLoopIcon name="search" className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="search" 
                        placeholder="Buscar término..." 
                        className="w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/20 border-border bg-background"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      {glossaryTerms.map((item, index) => (
                        <Card key={index}>
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">{item.term}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm">{item.definition}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button className="flex items-center gap-2">
                    <BeLoopIcon name="download" size={16} />
                    Descargar glosario completo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* DATA */}
            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="barChart" size={20} className="mr-2" />
                    Data y Estadísticas
                  </CardTitle>
                  <CardDescription>
                    Información actualizada sobre economía circular, legislación y tendencias globales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {dataStats.map((stat, index) => (
                        <Card key={index}>
                          <CardHeader className="p-4 pb-2">
                            <CardDescription className="line-clamp-2 h-10">{stat.label}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant={stat.change.includes('+') ? "default" : "destructive"} className="text-xs">
                                {stat.change}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{stat.year}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Datasets disponibles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium">Indicadores de Economía Circular</h3>
                              <Badge variant="outline">2025</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">Colección de métricas clave para medir la transición hacia una economía circular en diferentes industrias.</p>
                            <Button size="sm" variant="outline" className="w-full">
                              <BeLoopIcon name="download" size={14} className="mr-2" />
                              Descargar CSV
                            </Button>
                          </div>
                          <div className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium">Legislación REP Global</h3>
                              <Badge variant="outline">2025</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">Compilación de normativas REP a nivel mundial, con detalles sobre requisitos y metas por país.</p>
                            <Button size="sm" variant="outline" className="w-full">
                              <BeLoopIcon name="download" size={14} className="mr-2" />
                              Descargar CSV
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button className="flex items-center gap-2">
                    <BeLoopIcon name="externalLink" size={16} />
                    Explorar Centro de Datos
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* CERTIFICACIONES */}
            <TabsContent value="certificaciones">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BeLoopIcon name="badgeCheck" size={20} className="mr-2" />
                    Certificaciones
                  </CardTitle>
                  <CardDescription>
                    Programas de certificación profesional en economía circular y gestión ambiental
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {certifications.map((cert) => (
                      <Card key={cert.id} className="overflow-hidden">
                        <div className="bg-muted/30 p-6 flex items-center justify-center">
                          <BeLoopIcon name="award" size={48} className="text-primary/70" />
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg">{cert.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Nivel:</span>
                            <Badge variant="outline">{cert.level}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Duración:</span>
                            <span className="text-sm font-medium">{cert.duration}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Módulos:</span>
                            <span className="text-sm font-medium">{cert.modules}</span>
                          </div>
                          <div>
                            <span className="text-sm">Requisitos:</span>
                            <div className="text-sm mt-1 text-muted-foreground">{cert.requirements}</div>
                          </div>
                          <div className="pt-2 border-t mt-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{cert.price}</span>
                              <Button size="sm">Ver detalles</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" className="flex items-center gap-2">
                    <BeLoopIcon name="info" size={16} />
                    Proceso de certificación
                  </Button>
                  <Button className="flex items-center gap-2">
                    <BeLoopIcon name="mail" size={16} />
                    Solicitar información
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Academy;
