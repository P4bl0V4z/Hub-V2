
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
import { Shield } from "lucide-react";
import { ContextHelp } from "@/components/ContextualHelp";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import BeLoopIcon from "@/components/BeLoopIcons";
import { useToast } from "@/hooks/use-toast";

interface PassportManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockPassports = [
  { id: 1, name: "Laptop Pro X1", sku: "LP-X1-2025", category: "Electrónicos", created: "01/05/2025", status: "active", views: 256 },
  { id: 2, name: "Smartphone Galaxy", sku: "SG-2025", category: "Electrónicos", created: "28/04/2025", status: "active", views: 189 },
  { id: 3, name: "Caja de cartón estándar", sku: "CCE-25", category: "Embalajes", created: "25/04/2025", status: "review", views: 42 },
  { id: 4, name: "Bolsa reutilizable", sku: "BR-ECO", category: "Envases", created: "22/04/2025", status: "active", views: 137 },
  { id: 5, name: "Botella de vidrio 500ml", sku: "BV-500", category: "Envases", created: "20/04/2025", status: "inactive", views: 95 },
];

export default function PassportManagementDialog({ open, onOpenChange }: PassportManagementDialogProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedPassport, setSelectedPassport] = useState<any>(null);
  const { toast } = useToast();
  
  const handlePassportClick = (passport: any) => {
    setSelectedPassport(passport);
    setOpenDrawer(true);
  };
  
  const handlePublishPassport = () => {
    toast({
      title: "Pasaporte actualizado",
      description: `El pasaporte para ${selectedPassport?.name} ha sido publicado.`,
    });
    setOpenDrawer(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": 
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case "review": 
        return <Badge className="bg-amber-100 text-amber-800">En revisión</Badge>;
      case "inactive": 
        return <Badge className="bg-slate-100 text-slate-800">Inactivo</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Gestión de Pasaportes Digitales
              <ContextHelp 
                id="passport-management"
                content="Administre y monitoree los pasaportes digitales de sus productos"
                useHoverCard={true}
                size={16}
                title="Gestión de Pasaportes"
              />
            </DialogTitle>
            <DialogDescription>
              Administre y monitoree los pasaportes digitales de sus productos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="active">Activos</TabsTrigger>
                  <TabsTrigger value="review">En revisión</TabsTrigger>
                  <TabsTrigger value="inactive">Inactivos</TabsTrigger>
                </TabsList>
                
                <div className="relative">
                  <BeLoopIcon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9 w-64" placeholder="Buscar pasaportes..." />
                </div>
              </div>
              
              <TabsContent value="all" className="pt-2">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Creación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Visualizaciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPassports.map((passport) => (
                        <TableRow 
                          key={passport.id} 
                          className="cursor-pointer hover:bg-muted/40"
                          onClick={() => handlePassportClick(passport)}
                        >
                          <TableCell className="font-medium">{passport.name}</TableCell>
                          <TableCell>{passport.sku}</TableCell>
                          <TableCell>{passport.category}</TableCell>
                          <TableCell>{passport.created}</TableCell>
                          <TableCell>{getStatusBadge(passport.status)}</TableCell>
                          <TableCell className="text-right">{passport.views}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="pt-2">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Creación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Visualizaciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPassports.filter(p => p.status === 'active').map((passport) => (
                        <TableRow 
                          key={passport.id} 
                          className="cursor-pointer hover:bg-muted/40"
                          onClick={() => handlePassportClick(passport)}
                        >
                          <TableCell className="font-medium">{passport.name}</TableCell>
                          <TableCell>{passport.sku}</TableCell>
                          <TableCell>{passport.category}</TableCell>
                          <TableCell>{passport.created}</TableCell>
                          <TableCell>{getStatusBadge(passport.status)}</TableCell>
                          <TableCell className="text-right">{passport.views}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Similar TabsContent blocks for other tabs */}
              <TabsContent value="review" className="pt-2">
                {/* Filter for review status */}
              </TabsContent>
              
              <TabsContent value="inactive" className="pt-2">
                {/* Filter for inactive status */}
              </TabsContent>
            </Tabs>
            
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="flex items-start space-x-3">
                <BeLoopIcon name="info" size={16} className="text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Monitoreo de pasaportes</h4>
                  <p className="text-sm text-muted-foreground">
                    Haga clic en cualquier pasaporte para ver detalles adicionales y estadísticas de uso.
                    Los pasaportes inactivos no son visibles para los usuarios finales.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
            <Button>Crear Nuevo Pasaporte</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Drawer with passport details */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle>Detalles del Pasaporte</DrawerTitle>
          </DrawerHeader>
          {selectedPassport && (
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPassport.name}</h2>
                    <p className="text-muted-foreground">{selectedPassport.sku}</p>
                  </div>
                  {getStatusBadge(selectedPassport.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 text-center">
                    <div className="text-3xl font-bold">{selectedPassport.views}</div>
                    <div className="text-sm text-muted-foreground">Visualizaciones</div>
                  </div>
                  <div className="border rounded-md p-4 text-center">
                    <div className="text-3xl font-bold">42</div>
                    <div className="text-sm text-muted-foreground">Escaneos QR</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Información del producto</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Categoría</div>
                      <div>{selectedPassport.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Fecha de creación</div>
                      <div>{selectedPassport.created}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">URL del pasaporte</h3>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={`https://dpp.beloop.com/${selectedPassport.sku}`} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <BeLoopIcon name="copy" size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Código QR</h3>
                  <div className="flex justify-center">
                    <div className="border p-4 rounded-md bg-white">
                      <div className="w-32 h-32 flex items-center justify-center">
                        <BeLoopIcon name="qrCode" size={96} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button variant="outline" size="sm">
                      <BeLoopIcon name="download" size={14} className="mr-2" />
                      Descargar QR
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DrawerFooter className="border-t">
            {selectedPassport && selectedPassport.status === "review" && (
              <Button onClick={handlePublishPassport}>Publicar Pasaporte</Button>
            )}
            {selectedPassport && selectedPassport.status === "active" && (
              <Button variant="outline">Editar Pasaporte</Button>
            )}
            <Button variant="outline" onClick={() => setOpenDrawer(false)}>Cerrar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
