
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, QrCode } from 'lucide-react';
import { toast } from "sonner";
import { formatProductPassportsForExport, exportToExcel } from "@/utils/excelExport";

interface PassportsListProps {
  onOpenTimeline: () => void;
}

const PassportsList: React.FC<PassportsListProps> = ({ onOpenTimeline }) => {
  // Datos de ejemplo para pasaportes
  const passports = [
    { id: 1, name: "Laptop Pro X1", sku: "LP-X1-2025", status: "active", created: "15/04/2025", standard: "ESPR (UE)" },
    { id: 2, name: "Smartphone Galaxy", sku: "SG-2025", status: "pending", created: "10/04/2025", standard: "ESPR (UE)" },
    { id: 3, name: "Botella de vidrio 500ml", sku: "BV-500", status: "active", created: "05/04/2025", standard: "ESPR (UE)" },
  ];
  
  // Handle export of passport data
  const handleExportPassportData = () => {
    const data = formatProductPassportsForExport();
    exportToExcel(
      data, 
      'Pasaportes_Digitales', 
      'Pasaportes Productos',
      { 'Producto': 25, 'Materiales Principales': 30, 'URL Pasaporte': 40 }
    );
    toast.success("Datos de pasaportes exportados correctamente");
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Pasaportes Digitales</CardTitle>
          <CardDescription>
            Listado de pasaportes digitales de productos generados
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleExportPassportData}
          >
            <Download className="h-4 w-4 mr-1" />
            Exportar Excel
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Estándar</TableHead>
              <TableHead>Creación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passports.map(passport => (
              <TableRow key={passport.id}>
                <TableCell className="font-medium">{passport.name}</TableCell>
                <TableCell>{passport.sku}</TableCell>
                <TableCell>{passport.standard}</TableCell>
                <TableCell>{passport.created}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      passport.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }
                  >
                    {passport.status === 'active' ? 'Activo' : 'Pendiente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onOpenTimeline}
                      title="Ver línea de tiempo"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title="Generar código QR"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PassportsList;
