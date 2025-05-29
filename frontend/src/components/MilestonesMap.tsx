
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeLoopIcon from '@/components/BeLoopIcons';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Milestone {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
  icon: string;
  description: string;
  details: string;
}

const milestones: Milestone[] = [
  {
    id: "rep30",
    title: "Cumplimiento REP 30%",
    status: "completed",
    progress: 100,
    icon: "check",
    description: "Registro básico como productor y declaración inicial",
    details: "Has completado el registro como productor en el sistema REP, realizado tu primera declaración de productos y establecido el plan inicial de gestión de residuos. Este hito representa el cumplimiento mínimo para evitar sanciones."
  },
  {
    id: "rep60",
    title: "Cumplimiento REP 60%",
    status: "in-progress",
    progress: 75,
    icon: "check",
    description: "Implementación de sistemas de trazabilidad",
    details: "Este nivel implica implementar sistemas de trazabilidad completos para tus productos, establecer acuerdos con gestores autorizados y cumplir con las metas intermedias de valorización. Actualmente estás en un 75% de avance en este hito."
  },
  {
    id: "rep100",
    title: "Cumplimiento REP 100%",
    status: "pending",
    progress: 0,
    icon: "check",
    description: "Cumplimiento total de obligaciones",
    details: "El cumplimiento total incluye alcanzar todas las metas de valorización, implementar ecodiseño en todos los productos, y establecer sistemas avanzados de logística inversa. Este nivel representa el cumplimiento total de las obligaciones REP."
  },
  {
    id: "footprint",
    title: "Cálculo de huella de productos",
    status: "in-progress",
    progress: 40,
    icon: "alert-triangle",
    description: "Análisis de impacto ambiental",
    details: "El cálculo de huella de carbono de tus productos permitirá identificar puntos críticos en el ciclo de vida y establecer estrategias de reducción de impacto. Has completado el análisis para un 40% de tu portafolio de productos."
  },
  {
    id: "epd",
    title: "EPD de productos",
    status: "pending",
    progress: 0,
    icon: "circle-check",
    description: "Declaraciones ambientales de producto",
    details: "Las Declaraciones Ambientales de Producto (EPD) son documentos verificados que comunican información transparente y comparable sobre el impacto ambiental del ciclo de vida de tus productos."
  },
  {
    id: "passports",
    title: "Pasaportes digitales de productos",
    status: "pending",
    progress: 0,
    icon: "square-check",
    description: "Trazabilidad digital completa",
    details: "Los pasaportes digitales contienen información completa sobre composición, origen, uso y fin de vida de tus productos. Permiten una trazabilidad total y cumplen con las emergentes regulaciones de la economía circular."
  }
];

const MilestonesMap = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "pending": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": 
        return <Badge variant="success">Completado</Badge>;
      case "in-progress": 
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">En progreso</Badge>;
      case "pending": 
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200">Pendiente</Badge>;
      default: 
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="flex items-center gap-2 text-primary">
          <span>Mapa de Implementación</span>
          <BeLoopIcon name="map" className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="relative pb-6">
          {/* Línea de tiempo horizontal con gradiente */}
          <div className="absolute top-7 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-violet-100 to-purple-100"></div>
          
          <div className="grid grid-cols-3 gap-2 relative">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex flex-col items-center group">
                <Button
                  onClick={() => handleMilestoneClick(milestone)}
                  className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-200 shadow-sm
                    ${milestone.status === "completed" ? "border-green-100 bg-green-50 hover:bg-green-100" : 
                    milestone.status === "in-progress" ? "border-blue-100 bg-blue-50 hover:bg-blue-100" : 
                    "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}
                  variant="ghost"
                >
                  <BeLoopIcon 
                    name={milestone.icon} 
                    className={`h-6 w-6 transition-all duration-200
                      ${milestone.status === "completed" ? "text-green-600" : 
                      milestone.status === "in-progress" ? "text-blue-600" : 
                      "text-gray-400"}`}
                  />
                  {milestone.status === "in-progress" && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center animate-pulse">
                      <span className="text-xs font-semibold text-blue-600">{milestone.progress}%</span>
                    </div>
                  )}
                </Button>
                
                <div className="mt-3 text-center transition-all duration-200 group-hover:translate-y-0.5">
                  <p className="text-sm font-medium text-gray-800">{milestone.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[90%] mx-auto">{milestone.description}</p>
                  
                  <div className="mt-2 flex justify-center">
                    {getStatusBadge(milestone.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedMilestone && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BeLoopIcon 
                  name={selectedMilestone.icon} 
                  className={`h-5 w-5 ${
                    selectedMilestone.status === "completed" ? "text-green-600" : 
                    selectedMilestone.status === "in-progress" ? "text-blue-600" : 
                    "text-gray-600"
                  }`} 
                />
                <span>{selectedMilestone.title}</span>
              </DialogTitle>
              <DialogDescription>
                {selectedMilestone.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <div>
                    {getStatusBadge(selectedMilestone.status)}
                  </div>
                </div>
                {selectedMilestone.status === "in-progress" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progreso:</span>
                      <span className="text-sm font-medium text-blue-600">{selectedMilestone.progress}%</span>
                    </div>
                    <Progress 
                      value={selectedMilestone.progress} 
                      className="h-2" 
                      indicatorClassName={
                        selectedMilestone.status === "in-progress" ? "bg-blue-500" : "bg-green-500"
                      }
                    />
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-sm font-medium mb-2 text-gray-800">Detalles</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedMilestone.details}
                </p>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  variant={selectedMilestone.status === "completed" ? "default" : 
                          selectedMilestone.status === "in-progress" ? "outline" : "secondary"}
                  className={selectedMilestone.status === "completed" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => setDialogOpen(false)}
                >
                  {selectedMilestone.status === "completed" ? "Ver documentación" : 
                   selectedMilestone.status === "in-progress" ? "Continuar implementación" : 
                   "Comenzar implementación"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
};

export default MilestonesMap;
