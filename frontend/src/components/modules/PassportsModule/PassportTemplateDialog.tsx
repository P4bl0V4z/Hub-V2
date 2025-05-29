
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, Plus } from "lucide-react";
import { ContextHelp } from "@/components/ContextualHelp";
import BeLoopIcon from "@/components/BeLoopIcons";

interface PassportTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PassportTemplateDialog({ open, onOpenChange }: PassportTemplateDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Plantillas de Pasaportes Digitales
            <ContextHelp 
              id="passport-templates"
              content="Gestione plantillas para la creación rápida de pasaportes digitales"
              useHoverCard={true}
              size={16}
              title="Plantillas de Pasaportes"
            />
          </DialogTitle>
          <DialogDescription>
            Configure y gestione plantillas para la creación rápida de pasaportes digitales
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex space-x-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Seleccionar plantilla</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plantilla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Plantilla Estándar</SelectItem>
                  <SelectItem value="food">Productos Alimenticios</SelectItem>
                  <SelectItem value="electronics">Productos Electrónicos</SelectItem>
                  <SelectItem value="textile">Productos Textiles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>
          
          <Tabs defaultValue="fields">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fields">Campos</TabsTrigger>
              <TabsTrigger value="appearance">Apariencia</TabsTrigger>
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Información básica del producto</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <BeLoopIcon name="check" size={12} className="text-primary" />
                        </div>
                        <Label>Nombre del producto</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Obligatorio</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <BeLoopIcon name="check" size={12} className="text-primary" />
                        </div>
                        <Label>SKU / Código del producto</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Obligatorio</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <BeLoopIcon name="check" size={12} className="text-primary" />
                        </div>
                        <Label>Fabricante</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Obligatorio</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Materiales</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <BeLoopIcon name="check" size={12} className="text-primary" />
                        </div>
                        <Label>Lista de materiales</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Obligatorio</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <BeLoopIcon name="check" size={12} className="text-primary" />
                        </div>
                        <Label>Porcentaje de contenido reciclado</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Obligatorio</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-3">
                          <BeLoopIcon name="plus" size={12} className="text-muted-foreground" />
                        </div>
                        <Label>Origen de los materiales</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Opcional</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Fin de vida</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <BeLoopIcon name="check" size={12} className="text-primary" />
                        </div>
                        <Label>Instrucciones de reciclaje</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Obligatorio</div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-3">
                          <BeLoopIcon name="plus" size={12} className="text-muted-foreground" />
                        </div>
                        <Label>Índice de reciclabilidad</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">Opcional</div>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir nueva sección
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Nombre de la plantilla</Label>
                    <Input id="template-name" defaultValue={selectedTemplate === "standard" ? "Plantilla Estándar" : selectedTemplate === "food" ? "Productos Alimenticios" : selectedTemplate === "electronics" ? "Productos Electrónicos" : "Productos Textiles"} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-category">Categoría</Label>
                    <Select defaultValue="general">
                      <SelectTrigger id="template-category">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="food">Alimentación</SelectItem>
                        <SelectItem value="electronics">Electrónicos</SelectItem>
                        <SelectItem value="textile">Textiles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Estilo de la plantilla</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Colores</Label>
                      <div className="flex space-x-2">
                        <div className="w-10 h-10 rounded border flex flex-col items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary"></div>
                          <div className="text-xs mt-0.5">Principal</div>
                        </div>
                        <div className="w-10 h-10 rounded border flex flex-col items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-secondary"></div>
                          <div className="text-xs mt-0.5">Sec.</div>
                        </div>
                        <div className="w-10 h-10 rounded border flex flex-col items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-accent"></div>
                          <div className="text-xs mt-0.5">Acento</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="h-10 border rounded flex items-center justify-center">
                        <BeLoopIcon name="image" size={16} className="mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Sin logo</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Formato de salida</h3>
                  <div className="flex space-x-4">
                    <div className="border rounded-md p-3 flex-1 text-center cursor-pointer bg-primary/10">
                      <div className="text-sm font-medium mb-1">Digital</div>
                      <div className="text-xs text-muted-foreground">Web + QR</div>
                    </div>
                    <div className="border rounded-md p-3 flex-1 text-center cursor-pointer">
                      <div className="text-sm font-medium mb-1">PDF</div>
                      <div className="text-xs text-muted-foreground">Documento</div>
                    </div>
                    <div className="border rounded-md p-3 flex-1 text-center cursor-pointer">
                      <div className="text-sm font-medium mb-1">Etiqueta</div>
                      <div className="text-xs text-muted-foreground">Imprimible</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="pt-6">
              <div className="flex justify-center items-center">
                <div className="border rounded-lg p-6 max-w-md w-full bg-muted/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Pasaporte Digital</h3>
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-primary mb-2">Información del Producto</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Nombre:</span>
                          <span className="text-sm">Laptop Pro X1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">SKU:</span>
                          <span className="text-sm">LP-X1-2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Fabricante:</span>
                          <span className="text-sm">Tech Innovations Inc.</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-primary mb-2">Materiales</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Plástico:</span>
                          <span className="text-sm">30% (15% reciclado)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Aluminio:</span>
                          <span className="text-sm">25% (40% reciclado)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Otros:</span>
                          <span className="text-sm">45% (5% reciclado)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-primary mb-2">Fin de Vida</h4>
                      <p className="text-sm">Este producto debe ser llevado a un punto de reciclaje de electrónicos para su correcto procesamiento y recuperación de materiales.</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-muted flex items-center justify-center">
                        <BeLoopIcon name="qrCode" size={64} className="text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onOpenChange(false)}>Guardar Plantilla</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
