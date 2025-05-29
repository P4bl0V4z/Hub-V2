import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import BeLoopIcon from '@/components/BeLoopIcons';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  FileCheck,
  Users
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Event categories with their respective colors
const eventCategories = [
  { id: "audit", name: "Auditoría", color: "bg-blue-500", checked: true },
  { id: "review", name: "Revisión", color: "bg-purple-500", checked: true },
  { id: "deadline", name: "Vencimiento", color: "bg-red-500", checked: true },
  { id: "training", name: "Capacitación", color: "bg-green-500", checked: true },
  { id: "meeting", name: "Reunión", color: "bg-amber-500", checked: true },
];

const Calendar = () => {
  // Mock data for the calendar
  const currentMonth = "Mayo 2025";
  
  const upcomingEvents = [
    {
      id: 1,
      title: "Auditoría de Trazabilidad",
      date: "10 Mayo, 2025",
      time: "09:00 - 13:00",
      location: "Planta Principal",
      type: "audit",
      priority: "high"
    },
    {
      id: 2,
      title: "Revisión de Certificados",
      date: "15 Mayo, 2025",
      time: "14:30 - 16:00",
      location: "Sala de Reuniones A",
      type: "review",
      priority: "medium"
    },
    {
      id: 3,
      title: "Vencimiento Declaración REP",
      date: "31 Mayo, 2025",
      time: "23:59",
      location: "Sistema Digital",
      type: "deadline",
      priority: "high"
    },
    {
      id: 4,
      title: "Capacitación Economía Circular",
      date: "22 Mayo, 2025",
      time: "10:00 - 12:00",
      location: "Sala de Formación",
      type: "training",
      priority: "low"
    },
    {
      id: 5,
      title: "Revisión con Proveedores",
      date: "18 Mayo, 2025",
      time: "11:30 - 13:30",
      location: "Sala de Conferencias",
      type: "meeting",
      priority: "medium"
    }
  ];

  // Mock calendar grid (simplified)
  const calendarDays = Array.from({ length: 35 }, (_, i) => ({
    day: ((i - 3 + 31) % 31) + 1, // Simple way to represent days in a month
    isCurrentMonth: i >= 3 && i < 33, // Filter for current month days
    events: upcomingEvents.filter(event => {
      const eventDay = parseInt(event.date.split(" ")[0]);
      return eventDay === ((i - 3 + 31) % 31) + 1;
    })
  }));
  
  // Week days header
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Calendario</h1>
          <p className="text-muted-foreground">Gestión de fechas y eventos del ciclo de vida del producto</p>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">{currentMonth}</h2>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Día</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mes</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Evento
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="calendar">
          <TabsList className="mb-6">
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendario
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              <BeLoopIcon name="calendarCheck" className="mr-2 h-4 w-4" />
              Próximos Eventos
            </TabsTrigger>
            <TabsTrigger value="deadlines">
              <BeLoopIcon name="alertCircle" className="mr-2 h-4 w-4" />
              Fechas Críticas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-6">
            <div className="flex gap-6">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle>Calendario de Eventos</CardTitle>
                  <CardDescription>
                    Visualiza y gestiona los eventos relacionados con la trazabilidad y ciclo de vida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Week days header */}
                    {weekDays.map(day => (
                      <div 
                        key={day}
                        className="text-center py-2 font-medium text-xs text-muted-foreground"
                      >
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {calendarDays.map((day, index) => (
                      <div 
                        key={index}
                        className={`
                          min-h-20 p-1 border rounded-md 
                          ${day.isCurrentMonth ? 'bg-card' : 'bg-muted/50 text-muted-foreground'}
                          ${day.day === 10 ? 'ring-1 ring-primary' : ''}
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-xs p-1 ${day.day === 10 ? 'font-bold' : ''}`}>
                            {day.day}
                          </span>
                          
                          {day.events.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {day.events.length}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 mt-1">
                          {day.events.map(event => (
                            <div 
                              key={event.id}
                              className={`
                                text-xs p-1 rounded truncate
                                ${event.type === "audit" ? 'bg-blue-100 text-blue-800 border-l-2 border-blue-500' : 
                                  event.type === "review" ? 'bg-purple-100 text-purple-800 border-l-2 border-purple-500' : 
                                  event.type === "deadline" ? 'bg-red-100 text-red-800 border-l-2 border-red-500' : 
                                  event.type === "training" ? 'bg-green-100 text-green-800 border-l-2 border-green-500' :
                                  'bg-amber-100 text-amber-800 border-l-2 border-amber-500'}
                              `}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="w-72">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BeLoopIcon name="filter" size={18} />
                    Categorías de eventos
                  </CardTitle>
                  <CardDescription>
                    Filtra los eventos por tipo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventCategories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category.id}`} defaultChecked={category.checked} />
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <label htmlFor={`category-${category.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium text-sm mb-2">Leyenda de prioridad</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Alta</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm">Media</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Baja</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Lista de eventos programados para las próximas semanas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div 
                      key={event.id}
                      className="border rounded-md p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex flex-col space-y-1 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <Badge
                            className={
                              event.type === "audit" ? "bg-blue-500" :
                              event.type === "review" ? "bg-purple-500" :
                              event.type === "deadline" ? "bg-red-500" :
                              event.type === "training" ? "bg-green-500" :
                              "bg-amber-500"
                            }
                          >
                            {event.type === "audit" ? "Auditoría" :
                             event.type === "review" ? "Revisión" :
                             event.type === "deadline" ? "Vencimiento" :
                             event.type === "training" ? "Capacitación" :
                             "Reunión"}
                          </Badge>
                          
                          <div className="flex items-center text-xs text-muted-foreground mt-4">
                            {event.type !== "training" && (
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                <span>5 asistentes</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deadlines">
            <Card>
              <CardHeader>
                <CardTitle>Fechas Críticas</CardTitle>
                <CardDescription>
                  Vencimientos de certificados, declaraciones y documentación regulatoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                        <FileCheck className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Declaración REP Q2 2025</h3>
                        <p className="text-sm text-muted-foreground">Vence: 31/05/2025</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Urgente</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                        <FileCheck className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Actualización ISO 14001</h3>
                        <p className="text-sm text-muted-foreground">Vence: 15/06/2025</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Próximamente</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                        <FileCheck className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Reporte de Huella de Carbono</h3>
                        <p className="text-sm text-muted-foreground">Vence: 30/06/2025</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">Próximamente</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <FileCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Renovación de Permisos Ambientales</h3>
                        <p className="text-sm text-muted-foreground">Vence: 15/08/2025</p>
                      </div>
                    </div>
                    <Badge variant="outline">Planificado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Calendar;
