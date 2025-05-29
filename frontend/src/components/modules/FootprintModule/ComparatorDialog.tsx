
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

// Define a footprint type locally instead of importing from @/types
interface Footprint {
  id: number;
  name: string;
  scope: string;
  value: number;
  unit: string;
  date: string;
}

interface ComparatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComparatorDialog: React.FC<ComparatorDialogProps> = ({ open, onOpenChange }) => {
  // Sample footprint data
  const footprints: Footprint[] = [
    { id: 1, name: "Producto A", scope: "Scope 1+2", value: 245, unit: "kgCO2e", date: "01/05/2025" },
    { id: 2, name: "Producto B", scope: "Scope 1+2+3", value: 320, unit: "kgCO2e", date: "15/04/2025" },
    { id: 3, name: "Producto C", scope: "Scope 1+2", value: 187, unit: "kgCO2e", date: "28/04/2025" },
    { id: 4, name: "Producto D", scope: "Scope 1+2+3", value: 412, unit: "kgCO2e", date: "20/04/2025" },
  ];
  
  const [selectedFootprints, setSelectedFootprints] = useState<Footprint[]>([]);

  const toggleFootprintSelection = (footprint: Footprint) => {
    setSelectedFootprints((prevSelected) => {
      if (prevSelected.find((item) => item.id === footprint.id)) {
        return prevSelected.filter((item) => item.id !== footprint.id);
      } else {
        return [...prevSelected, footprint];
      }
    });
  };

  const isFootprintSelected = (footprint: Footprint) => {
    return selectedFootprints.some((item) => item.id === footprint.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Comparador de Huellas</DialogTitle>
          <DialogDescription>
            Selecciona hasta dos huellas para comparar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Seleccionar</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Alcance</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {footprints.map((footprint) => (
                <TableRow key={footprint.id}>
                  <TableCell>
                    <Checkbox
                      checked={isFootprintSelected(footprint)}
                      onCheckedChange={() => toggleFootprintSelection(footprint)}
                      disabled={selectedFootprints.length >= 2 && !isFootprintSelected(footprint)}
                    />
                  </TableCell>
                  <TableCell>{footprint.name}</TableCell>
                  <TableCell>{footprint.scope}</TableCell>
                  <TableCell>{footprint.value}</TableCell>
                  <TableCell>{footprint.unit}</TableCell>
                  <TableCell>{footprint.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {selectedFootprints.length === 2 && (
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>{selectedFootprints[0].name}</CardTitle>
                <CardDescription>
                  {selectedFootprints[0].scope} - {selectedFootprints[0].date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Valor</TableCell>
                      <TableCell>{selectedFootprints[0].value}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Unidad</TableCell>
                      <TableCell>{selectedFootprints[0].unit}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Ver Informe
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{selectedFootprints[1].name}</CardTitle>
                <CardDescription>
                  {selectedFootprints[1].scope} - {selectedFootprints[1].date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Valor</TableCell>
                      <TableCell>{selectedFootprints[1].value}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Unidad</TableCell>
                      <TableCell>{selectedFootprints[1].unit}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Ver Informe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          {selectedFootprints.length === 2 && (
            <Button className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Descargar Comparación
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparatorDialog;
