import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, Info, Upload, Calculator, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContextHelp } from "@/components/ContextualHelp";
import { toast } from "sonner";
import { exportToExcel, formatBaselineDataForExport } from "@/utils/excelExport";

interface BaselineCalculationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BaselineCalculationDialog({ open, onOpenChange }: BaselineCalculationDialogProps) {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMethod, setSelectedMethod] = useState("produccion");
  
  // Handle export of baseline data
  const handleExportBaselineData = () => {
    const data = formatBaselineDataForExport();
    exportToExcel(
      data, 
      'Linea_Base_REP_Historico', 
      'Líneas Base REP',
      { 'Material': 20 }
    );
    toast.success("Datos de línea base exportados correctamente");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Cálculo de Línea Base REP
            <ContextHelp 
              id="baseline-calculator"
              content="Herramienta para calcular líneas base conforme a la normativa REP"
              useHoverCard={true}
              size={16}
              title="Cálculo de Línea Base"
            />
          </DialogTitle>
          <DialogDescription>
            Establezca valores de referencia para cumplimiento normativo REP
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex space-x-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Año de referencia</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex-1">
              <Label>Método de cálculo</Label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produccion">Datos de producción</SelectItem>
                  <SelectItem value="documentos">Documentos tributarios</SelectItem>
                  <SelectItem value="muestreo">Muestreo estadístico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Cargar datos
            </Button>
          </div>
          
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Calculadora</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="documentation">Documentación</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="pt-4 space-y-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-3">Materiales prioritarios</h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-3">
                    <Label className="font-medium">Material</Label>
                    <Label className="font-medium">Toneladas (Año)</Label>
                    <Label className="font-medium">Meta (%)</Label>
                    <Label className="font-medium">Meta (Ton)</Label>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-4 gap-3 items-center">
                    <div>Cartón y Papel</div>
                    <Input type="number" defaultValue="5000" className="h-8" />
                    <div className="flex items-center">
                      <Input type="number" defaultValue="75" className="h-8 w-16 mr-2" />
                      <span>%</span>
                    </div>
                    <div className="font-medium">3,750 Ton</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 items-center">
                    <div>Plástico</div>
                    <Input type="number" defaultValue="3600" className="h-8" />
                    <div className="flex items-center">
                      <Input type="number" defaultValue="45" className="h-8 w-16 mr-2" />
                      <span>%</span>
                    </div>
                    <div className="font-medium">1,620 Ton</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 items-center">
                    <div>Vidrio</div>
                    <Input type="number" defaultValue="3000" className="h-8" />
                    <div className="flex items-center">
                      <Input type="number" defaultValue="60" className="h-8 w-16 mr-2" />
                      <span>%</span>
                    </div>
                    <div className="font-medium">1,800 Ton</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center bg-blue-50 p-3 rounded-md border border-blue-200">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  La calculadora aplica los porcentajes de valorización establecidos en el Decreto Supremo N°12 
                  para cada material prioritario y periodo de cumplimiento.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="pt-4">
              <div className="border rounded-md p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Línea Base 2024</h3>
                      <p className="text-sm text-muted-foreground">Establecida el 15/01/2024</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Activa</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Cartón y Papel</p>
                      <p className="font-medium">4,500 Ton</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Plástico</p>
                      <p className="font-medium">3,200 Ton</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vidrio</p>
                      <p className="font-medium">2,800 Ton</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">Ver Detalles</Button>
                    <Button variant="outline" size="sm" onClick={handleExportBaselineData}>
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documentation" className="pt-4">
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Documentación Requerida</h3>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    <li>Registro de ventas de productos con envases y embalajes</li>
                    <li>Fichas técnicas de materiales</li>
                    <li>Certificados de composición de materiales</li>
                    <li>Declaraciones juradas de proveedores</li>
                    <li>Informes de laboratorio (para verificación de composición)</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Referencias Normativas</h3>
                  <ul className="space-y-2 pl-5 list-disc text-sm">
                    <li>Ley REP 20.920 - Artículos 9 al 14</li>
                    <li>Decreto Supremo N°12 - Metas de recolección y valorización</li>
                    <li>Resolución Exenta N°1492 - Metodología de establecimiento de línea base</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onOpenChange(false)}>Guardar Línea Base</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
