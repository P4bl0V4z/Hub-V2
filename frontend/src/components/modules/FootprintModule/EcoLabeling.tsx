
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tag } from "lucide-react";
import { ContextHelp } from "@/components/ContextualHelp";
import BeLoopIcon from "@/components/BeLoopIcons";
import EcoLabelingDialog from "./EcoLabelingDialog";

interface EcoLabelingProps {
  selectedProduct: string;
}

const EcoLabeling = ({ selectedProduct }: EcoLabelingProps) => {
  const [openLabelingDialog, setOpenLabelingDialog] = useState(false);
  
  const labelTemplates = [
    { id: "standard", name: "Estándar", description: "Etiqueta completa con información detallada de sostenibilidad" },
    { id: "simple", name: "Simplificada", description: "Versión reducida con información esencial" },
    { id: "carbon", name: "Huella de Carbono", description: "Enfocada en emisiones de CO₂e" },
  ];
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Etiquetado Ecológico
          <ContextHelp 
            id="eco-labeling"
            content="Cree y gestione etiquetas ecológicas para sus productos"
            useHoverCard={true}
            size={16}
            title="Etiquetado Ecológico"
          />
        </CardTitle>
        <CardDescription>
          Cree y gestione etiquetas ecológicas para sus productos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!selectedProduct ? (
            <div className="bg-muted/30 p-6 rounded-md text-center">
              <Tag size={48} className="text-muted-foreground mb-4 mx-auto" />
              <p className="text-muted-foreground">Seleccione un producto para crear y gestionar sus etiquetas ecológicas</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Plantillas disponibles</h3>
                <Button onClick={() => setOpenLabelingDialog(true)}>
                  <BeLoopIcon name="plus" size={16} className="mr-2" />
                  Nueva Etiqueta
                </Button>
              </div>
              
              <Tabs defaultValue="standard">
                <TabsList className="w-full">
                  {labelTemplates.map(template => (
                    <TabsTrigger key={template.id} value={template.id} className="flex-1">
                      {template.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {labelTemplates.map(template => (
                  <TabsContent key={template.id} value={template.id} className="pt-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium mb-2">Plantilla: {template.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {template.description}
                          </p>
                        </div>
                        {template.id === "standard" && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Recomendada</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 bg-muted/30 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Información incluida</h4>
                          <ul className="text-sm space-y-2">
                            {template.id === "standard" && (
                              <>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Huella de carbono (kg CO₂e)</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Materiales y porcentajes</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Contenido reciclado</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Instrucciones de reciclaje</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Código QR para información extendida</span>
                                </li>
                              </>
                            )}
                            
                            {template.id === "simple" && (
                              <>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Materiales principales</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Instrucciones de reciclaje</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Código QR para información extendida</span>
                                </li>
                              </>
                            )}
                            
                            {template.id === "carbon" && (
                              <>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Huella de carbono total (kg CO₂e)</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Desglose por etapas del ciclo de vida</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Comparativa con productos similares</span>
                                </li>
                                <li className="flex items-center">
                                  <BeLoopIcon name="check" size={16} className="text-green-500 mr-2" />
                                  <span>Código QR para información extendida</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                        
                        <div className="border rounded-md p-3 flex items-center justify-center">
                          <div className="text-center">
                            <BeLoopIcon name="tag" size={64} className="text-muted-foreground mx-auto mb-4" />
                            <Button variant="outline" size="sm" onClick={() => setOpenLabelingDialog(true)}>
                              <BeLoopIcon name="eye" size={14} className="mr-2" />
                              Vista previa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="flex justify-end">
                <Button onClick={() => setOpenLabelingDialog(true)}>
                  <BeLoopIcon name="tag" size={16} className="mr-2" />
                  Crear Etiqueta
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {/* Dialog */}
      <EcoLabelingDialog 
        open={openLabelingDialog} 
        onOpenChange={setOpenLabelingDialog} 
        selectedProduct={selectedProduct ? { name: selectedProduct } : null}
      />
    </Card>
  );
};

export default EcoLabeling;

// Helper component for badges
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${className}`}>
    {children}
  </span>
);
