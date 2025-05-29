
import React from "react";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Plus, Search } from "lucide-react";
import { ContextHelp } from "@/components/ContextualHelp";

const mockProviders = [
  { id: 1, name: "Eco Envases S.A.", materials: ["Plástico", "Cartón"], rating: "A", lastUpdate: "01/05/2025" },
  { id: 2, name: "Reciclados del Sur", materials: ["Vidrio", "Aluminio"], rating: "B", lastUpdate: "28/04/2025" },
  { id: 3, name: "Materiales Sostenibles", materials: ["Plástico", "Papel"], rating: "A", lastUpdate: "25/04/2025" },
];

interface ProviderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProviderManagementDialog({ open, onOpenChange }: ProviderManagementDialogProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "A": return "bg-green-100 text-green-800";
      case "B": return "bg-blue-100 text-blue-800";
      case "C": return "bg-amber-100 text-amber-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5" />
            Gestión de Proveedores
            <ContextHelp 
              id="provider-management"
              content="Administre y evalúe proveedores para cumplir con requisitos REP"
              useHoverCard={true}
              size={16}
              title="Gestión de Proveedores"
            />
          </DialogTitle>
          <DialogDescription>
            Sistema de registro y evaluación de proveedores según criterios REP
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 h-9" placeholder="Buscar proveedores..." />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Materiales</TableHead>
                  <TableHead>Rating REP</TableHead>
                  <TableHead>Última Actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell>{provider.materials.join(", ")}</TableCell>
                    <TableCell>
                      <Badge className={getRatingColor(provider.rating)}>
                        Rating {provider.rating}
                      </Badge>
                    </TableCell>
                    <TableCell>{provider.lastUpdate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Editar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-1">Criterios de Evaluación REP</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Certificaciones ambientales</li>
              <li>Sistemas de gestión de residuos</li>
              <li>Trazabilidad de materiales</li>
              <li>Cumplimiento normativo REP</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={() => onOpenChange(false)}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
