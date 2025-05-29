
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from '@/components/Sidebar';
import BeLoopIcon from '@/components/BeLoopIcons';

// Sample data for tickets
const ticketData = [
  { 
    id: 1, 
    title: "Problema con carga de datos REP",
    status: "Abierto",
    priority: "Alta",
    date: "05/05/2025",
    lastUpdate: "Hace 2 horas",
    department: "Soporte Técnico",
    messages: [
      {
        sender: "usuario",
        name: "Juan Pérez",
        message: "Estoy teniendo problemas para cargar los datos de REP del mes pasado. El sistema me muestra un error sobre formato incorrecto.",
        time: "05/05/2025 10:23"
      },
      {
        sender: "soporte",
        name: "María González",
        message: "Hola Juan, gracias por contactarnos. ¿Podrías indicarnos qué tipo de archivo estás intentando subir y el mensaje de error exacto?",
        time: "05/05/2025 11:15"
      },
      {
        sender: "usuario",
        name: "Juan Pérez",
        message: "Estoy subiendo un archivo Excel con el formato que siempre uso. El error dice 'Formato de columna incorrecto en Columna C'.",
        time: "05/05/2025 11:32"
      }
    ]
  },
  { 
    id: 2, 
    title: "Consulta sobre certificación de materiales",
    status: "Abierto",
    priority: "Media",
    date: "04/05/2025",
    lastUpdate: "Hace 1 día",
    department: "Consultoría",
    messages: [
      {
        sender: "usuario",
        name: "Ana Silva",
        message: "Necesito información sobre el proceso de certificación de materiales reciclados para nuestros nuevos productos.",
        time: "04/05/2025 15:10"
      },
      {
        sender: "soporte",
        name: "Carlos López",
        message: "Hola Ana, para la certificación de materiales reciclados necesitarás completar el formulario disponible en la sección de Documentos y adjuntar los certificados de origen.",
        time: "04/05/2025 16:25"
      }
    ]
  },
  { 
    id: 3, 
    title: "Solicitud de capacitación",
    status: "Cerrado",
    priority: "Baja",
    date: "30/04/2025",
    lastUpdate: "Hace 5 días",
    department: "Capacitación",
    messages: [
      {
        sender: "usuario",
        name: "Roberto Méndez",
        message: "Quisiera solicitar una capacitación para nuestro equipo sobre el nuevo módulo de Pasaportes Digitales.",
        time: "30/04/2025 09:45"
      },
      {
        sender: "soporte",
        name: "Laura Sánchez",
        message: "Hola Roberto, tenemos disponibilidad para realizar la capacitación la próxima semana. ¿Qué día les resultaría más conveniente?",
        time: "30/04/2025 11:30"
      },
      {
        sender: "usuario",
        name: "Roberto Méndez",
        message: "El martes de la próxima semana sería ideal para nosotros.",
        time: "30/04/2025 13:15"
      },
      {
        sender: "soporte",
        name: "Laura Sánchez",
        message: "Perfecto, he agendado la capacitación para el martes a las 10:00 hrs. Recibirán un correo con los detalles de conexión.",
        time: "30/04/2025 15:00"
      }
    ]
  }
];

// Sample data for team members
const collaboratorsData = [
  {
    id: 1,
    name: "Carolina Martínez",
    role: "Gerente de Sostenibilidad",
    avatar: "/placeholder.svg",
    status: "online",
    lastMessage: "Revisemos los avances del reporte de circularidad",
    lastMessageTime: "10:42"
  },
  {
    id: 2,
    name: "Andrés Rojas",
    role: "Analista de Cumplimiento",
    avatar: "/placeholder.svg",
    status: "offline",
    lastMessage: "Ya actualicé los datos de REP del primer trimestre",
    lastMessageTime: "Ayer"
  },
  {
    id: 3,
    name: "Patricia Vega",
    role: "Directora de Operaciones",
    avatar: "/placeholder.svg",
    status: "away",
    lastMessage: "Necesitamos coordinar la reunión con el GRANSIC",
    lastMessageTime: "Ayer"
  },
  {
    id: 4,
    name: "Equipo de Sostenibilidad",
    role: "8 miembros",
    avatar: "/placeholder.svg",
    status: "online",
    lastMessage: "Carolina: Les comparto el calendario de entregas",
    lastMessageTime: "Lun"
  }
];

const Messages = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(1);
  const [selectedCollaborator, setSelectedCollaborator] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // En una aplicación real, aquí enviaríamos el mensaje
      setNewMessage("");
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Mensajes</h1>
              <p className="text-muted-foreground">Gestione sus comunicaciones</p>
            </div>
            <Button className="mt-2">
              <BeLoopIcon name="plus" size={18} className="mr-2" />
              Nuevo mensaje
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="relative max-w-md">
              <BeLoopIcon 
                name="search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <Input 
                placeholder="Buscar mensajes..." 
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs defaultValue="tickets" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="tickets" className="flex items-center">
                <BeLoopIcon name="helpCircle" size={16} className="mr-2" />
                Tickets de consulta
              </TabsTrigger>
              <TabsTrigger value="colaboradores" className="flex items-center">
                <BeLoopIcon name="users" size={16} className="mr-2" />
                Colaboradores
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Tickets activos</CardTitle>
                    <CardDescription>
                      Gestione sus tickets de soporte y consultas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="space-y-2">
                      {ticketData.map((ticket) => (
                        <div 
                          key={ticket.id} 
                          className={`p-3 rounded-md cursor-pointer transition-colors ${selectedTicket === ticket.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                          onClick={() => setSelectedTicket(ticket.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{ticket.title}</h3>
                              <p className="text-xs text-muted-foreground">{ticket.department}</p>
                            </div>
                            <Badge 
                              variant={ticket.status === "Abierto" ? "outline" : "secondary"}
                              className="text-xs"
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>ID: #{ticket.id}</span>
                            <span>{ticket.lastUpdate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  {selectedTicket ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>
                              {ticketData.find(t => t.id === selectedTicket)?.title}
                            </CardTitle>
                            <CardDescription>
                              Ticket #{selectedTicket} • {ticketData.find(t => t.id === selectedTicket)?.department}
                            </CardDescription>
                          </div>
                          <Badge 
                            variant={ticketData.find(t => t.id === selectedTicket)?.status === "Abierto" ? "outline" : "secondary"}
                          >
                            {ticketData.find(t => t.id === selectedTicket)?.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex flex-col h-[400px]">
                          <div className="flex-1 overflow-y-auto p-4">
                            {ticketData.find(t => t.id === selectedTicket)?.messages.map((msg, idx) => (
                              <div key={idx} className={`flex mb-4 ${msg.sender === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'usuario' ? 'bg-primary/10 ml-auto' : 'bg-muted'}`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{msg.name}</span>
                                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                                  </div>
                                  <p className="text-sm">{msg.message}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="p-4 border-t">
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Escriba su mensaje..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                              <Button onClick={handleSendMessage}>
                                Enviar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <BeLoopIcon name="helpCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Seleccione un ticket para ver los detalles</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="colaboradores">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Colaboradores</CardTitle>
                    <CardDescription>
                      Comunicaciones con su equipo de trabajo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="space-y-2">
                      {collaboratorsData.map((collab) => (
                        <div 
                          key={collab.id} 
                          className={`p-3 rounded-md cursor-pointer transition-colors ${selectedCollaborator === collab.id ? 'bg-primary/10' : 'hover:bg-muted'}`}
                          onClick={() => setSelectedCollaborator(collab.id)}
                        >
                          <div className="flex gap-3 items-center">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={collab.avatar} />
                                <AvatarFallback>{collab.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-background ${
                                collab.status === 'online' ? 'bg-green-500' : 
                                collab.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h3 className="font-medium truncate">{collab.name}</h3>
                                <span className="text-xs text-muted-foreground">{collab.lastMessageTime}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{collab.role}</p>
                              <p className="text-xs truncate">{collab.lastMessage}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  {selectedCollaborator ? (
                    <>
                      <CardHeader className="border-b">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={collaboratorsData.find(c => c.id === selectedCollaborator)?.avatar} />
                            <AvatarFallback>
                              {collaboratorsData.find(c => c.id === selectedCollaborator)?.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{collaboratorsData.find(c => c.id === selectedCollaborator)?.name}</CardTitle>
                            <CardDescription>
                              {collaboratorsData.find(c => c.id === selectedCollaborator)?.role}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex flex-col h-[400px]">
                          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <p>Inicio de la conversación con {collaboratorsData.find(c => c.id === selectedCollaborator)?.name}</p>
                              <p className="text-sm">El historial completo de mensajes estará disponible próximamente</p>
                            </div>
                          </div>
                          <div className="p-4 border-t">
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Escriba su mensaje..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                              <Button onClick={handleSendMessage}>
                                Enviar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <BeLoopIcon name="users" size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Seleccione un colaborador para iniciar una conversación</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Messages;
