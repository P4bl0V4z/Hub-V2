
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock data
const mockProducts = [
  { id: 1, name: "Laptop Pro X1", sku: "LP-X1-2025", category: "Electrónicos", materials: ["Plástico", "Aluminio", "Componentes electrónicos"], rep: true, footprint: true, passport: true },
  { id: 2, name: "Smartphone Galaxy", sku: "SG-2025", category: "Electrónicos", materials: ["Plástico", "Vidrio", "Componentes electrónicos", "Litio"], rep: true, footprint: true, passport: false },
  { id: 3, name: "Botella de vidrio 500ml", sku: "BV-500", category: "Envases", materials: ["Vidrio", "Plástico"], rep: true, footprint: false, passport: true },
  { id: 4, name: "Caja de cartón estándar", sku: "CCE-25", category: "Embalajes", materials: ["Cartón", "Tintas"], rep: true, footprint: false, passport: false },
  { id: 5, name: "Bolsa reutilizable", sku: "BR-ECO", category: "Envases", materials: ["Polipropileno tejido", "Tintas ecológicas"], rep: false, footprint: true, passport: true },
  { id: 6, name: "Bandeja de aluminio", sku: "BA-30", category: "Envases", materials: ["Aluminio"], rep: false, footprint: true, passport: false },
  { id: 7, name: "Teléfono Fijo", sku: "TF-22", category: "Electrónicos", materials: ["Plástico", "Componentes electrónicos"], rep: true, footprint: false, passport: false },
  { id: 8, name: "Televisor Smart LED", sku: "TV-LED-55", category: "Electrónicos", materials: ["Plástico", "Vidrio", "Componentes electrónicos"], rep: true, footprint: true, passport: true }
];

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("master");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtramos productos por su tipo (REP, Huella, Pasaportes)
  const repProducts = mockProducts.filter(product => product.rep);
  const footprintProducts = mockProducts.filter(product => product.footprint);
  const passportProducts = mockProducts.filter(product => product.passport);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Maestro de Productos</h1>
              <p className="text-muted-foreground">Gestión centralizada del catálogo de productos</p>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="master">
                Maestro de Productos
              </TabsTrigger>
              <TabsTrigger value="rep">
                Inventario REP
              </TabsTrigger>
              <TabsTrigger value="footprint">
                Inventario Huella
              </TabsTrigger>
              <TabsTrigger value="passports">
                Inventario Pasaportes Digitales
              </TabsTrigger>
            </TabsList>
            
            {/* Pestaña: Maestro de Productos */}
            <TabsContent value="master">
              <div className="flex justify-between items-center mb-6">
                <div className="w-1/3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      className="w-full pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4" />
                    Exportar
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpFromLine className="h-4 w-4" />
                    Importar
                  </Button>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Nuevo Producto
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Materiales</TableHead>
                      <TableHead>REP</TableHead>
                      <TableHead>Huella</TableHead>
                      <TableHead>Pasaporte</TableHead>
                      <TableHead className="w-24 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.sku}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.materials.join(", ")}</TableCell>
                          <TableCell>{product.rep ? "✓" : "—"}</TableCell>
                          <TableCell>{product.footprint ? "✓" : "—"}</TableCell>
                          <TableCell>{product.passport ? "✓" : "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                          No se encontraron productos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Pestaña: Inventario REP */}
            <TabsContent value="rep">
              <div className="flex justify-between items-center mb-6">
                <div className="w-1/3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos REP..."
                      className="w-full pl-9"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Materiales</TableHead>
                      <TableHead className="w-24 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {repProducts.length > 0 ? (
                      repProducts.map(product => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.sku}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.materials.join(", ")}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Ver detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          No se encontraron productos REP
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Pestaña: Inventario Huella */}
            <TabsContent value="footprint">
              <div className="flex justify-between items-center mb-6">
                <div className="w-1/3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos con huella..."
                      className="w-full pl-9"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Materiales</TableHead>
                      <TableHead>Huella de Carbono</TableHead>
                      <TableHead className="w-24 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {footprintProducts.length > 0 ? (
                      footprintProducts.map(product => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.sku}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.materials.join(", ")}</TableCell>
                          <TableCell>{(Math.random() * 10).toFixed(2)} kg CO2e</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Ver análisis
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No se encontraron productos con huella
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Pestaña: Inventario Pasaportes Digitales */}
            <TabsContent value="passports">
              <div className="flex justify-between items-center mb-6">
                <div className="w-1/3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos con pasaporte..."
                      className="w-full pl-9"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4" />
                    Exportar
                  </Button>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Crear Pasaporte
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Materiales</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Escaneos</TableHead>
                      <TableHead className="w-24 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {passportProducts.length > 0 ? (
                      passportProducts.map(product => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.sku}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.materials.join(", ")}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Activo
                            </span>
                          </TableCell>
                          <TableCell>{Math.floor(Math.random() * 100)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Ver pasaporte
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No se encontraron productos con pasaporte
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
