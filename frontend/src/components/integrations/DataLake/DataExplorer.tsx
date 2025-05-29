
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, Download, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HelpTooltip from '@/components/HelpTooltip';

const DataExplorer = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for products
  const productData = [
    {
      id: "P-10234",
      name: "Catalizador Químico HD-500",
      category: "Catalizadores",
      source: "SAP ERP",
      lastUpdate: "2025-05-04",
      co2: "56.7",
      water: "85.2",
      energy: "1240",
      completeness: "100%"
    },
    {
      id: "P-10235",
      name: "Aditivo Ecológico Green Plus",
      category: "Aditivos",
      source: "SAP ERP",
      lastUpdate: "2025-05-04",
      co2: "12.3",
      water: "23.8",
      energy: "450",
      completeness: "100%"
    },
    {
      id: "P-10236",
      name: "Compuesto Base EC-100",
      category: "Compuestos",
      source: "SAP ERP",
      lastUpdate: "2025-05-03",
      co2: "34.5",
      water: "45.1",
      energy: "780",
      completeness: "92%"
    },
    {
      id: "P-10237",
      name: "Resina Sintética RS-200",
      category: "Resinas",
      source: "SAP ERP",
      lastUpdate: "2025-05-02",
      co2: "28.9",
      water: "38.4",
      energy: "620",
      completeness: "100%"
    },
    {
      id: "P-10238",
      name: "Catalizador Químico LD-300",
      category: "Catalizadores",
      source: "CSV Import",
      lastUpdate: "2025-05-01",
      co2: "48.2",
      water: "52.6",
      energy: "910",
      completeness: "88%"
    },
  ];

  // Sample data for suppliers
  const supplierData = [
    {
      id: "S-5021",
      name: "QuimiPro Internacional",
      category: "Materias primas",
      lastUpdate: "2025-05-04",
      products: "23",
      certificates: "4",
      completeness: "100%"
    },
    {
      id: "S-5022",
      name: "EcoSolutions GmbH",
      category: "Aditivos",
      lastUpdate: "2025-05-03",
      products: "12",
      certificates: "3",
      completeness: "95%"
    },
    {
      id: "S-5023",
      name: "CatalFuture Inc.",
      category: "Catalizadores",
      lastUpdate: "2025-05-02",
      products: "8",
      certificates: "5",
      completeness: "100%"
    },
  ];

  // Sample data for facilities
  const facilityData = [
    {
      id: "F-301",
      name: "Planta Barcelona",
      type: "Producción",
      lastUpdate: "2025-05-04",
      sensors: "48",
      emissions: "125.4",
      consumption: "4380",
      completeness: "100%"
    },
    {
      id: "F-302",
      name: "Centro de Distribución Madrid",
      type: "Distribución",
      lastUpdate: "2025-05-03",
      sensors: "24",
      emissions: "56.2",
      consumption: "2140",
      completeness: "98%"
    },
    {
      id: "F-303",
      name: "Laboratorio I+D Valencia",
      type: "Investigación",
      lastUpdate: "2025-05-02",
      sensors: "36",
      emissions: "42.8",
      consumption: "3250",
      completeness: "100%"
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedCategory("all");
    setSearchQuery("");
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleExport = () => {
    toast({
      title: "Exportación iniciada",
      description: "Los datos seleccionados se están exportando a CSV.",
    });
  };

  // Filter data based on search query and category
  const filterData = (data: any[], categoryField: string) => {
    return data.filter(item => {
      const matchesSearch = 
        searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || 
        item[categoryField] === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Get categories for the current tab
  const getCategories = () => {
    let data: any[] = [];
    let field = "";

    switch(activeTab) {
      case "products":
        data = productData;
        field = "category";
        break;
      case "suppliers":
        data = supplierData;
        field = "category";
        break;
      case "facilities":
        data = facilityData;
        field = "type";
        break;
    }

    // Extract unique categories
    const categories = Array.from(new Set(data.map(item => item[field])));
    return categories;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Explorador de Datos</h2>
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Vista Previa de Datos</CardTitle>
            <HelpTooltip content="Explora y filtra los datos disponibles en el DataLake" />
          </div>
          <CardDescription>
            Visualice, filtre y exporte datos desde diferentes fuentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
              <TabsTrigger value="facilities">Instalaciones</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-10" 
                    placeholder="Buscar..." 
                    value={searchQuery} 
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="w-64">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {getCategories().map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="products">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Fuente</TableHead>
                      <TableHead className="text-right">CO₂ (kg)</TableHead>
                      <TableHead className="text-right">Agua (m³)</TableHead>
                      <TableHead className="text-right">Energía (kWh)</TableHead>
                      <TableHead className="text-right">Completitud</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterData(productData, "category").map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>{product.source}</TableCell>
                        <TableCell className="text-right">{product.co2}</TableCell>
                        <TableCell className="text-right">{product.water}</TableCell>
                        <TableCell className="text-right">{product.energy}</TableCell>
                        <TableCell className="text-right">
                          {parseInt(product.completeness) < 100 ? (
                            <div className="flex items-center justify-end space-x-1">
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                              <span>{product.completeness}</span>
                            </div>
                          ) : (
                            product.completeness
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="suppliers">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Productos</TableHead>
                      <TableHead className="text-right">Certificados</TableHead>
                      <TableHead className="text-right">Completitud</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterData(supplierData, "category").map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.id}</TableCell>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{supplier.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{supplier.products}</TableCell>
                        <TableCell className="text-right">{supplier.certificates}</TableCell>
                        <TableCell className="text-right">
                          {parseInt(supplier.completeness) < 100 ? (
                            <div className="flex items-center justify-end space-x-1">
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                              <span>{supplier.completeness}</span>
                            </div>
                          ) : (
                            supplier.completeness
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="facilities">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Sensores</TableHead>
                      <TableHead className="text-right">Emisiones CO₂ (t)</TableHead>
                      <TableHead className="text-right">Consumo (kWh)</TableHead>
                      <TableHead className="text-right">Completitud</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterData(facilityData, "type").map((facility) => (
                      <TableRow key={facility.id}>
                        <TableCell className="font-medium">{facility.id}</TableCell>
                        <TableCell>{facility.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{facility.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{facility.sensors}</TableCell>
                        <TableCell className="text-right">{facility.emissions}</TableCell>
                        <TableCell className="text-right">{facility.consumption}</TableCell>
                        <TableCell className="text-right">
                          {parseInt(facility.completeness) < 100 ? (
                            <div className="flex items-center justify-end space-x-1">
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                              <span>{facility.completeness}</span>
                            </div>
                          ) : (
                            facility.completeness
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExplorer;
