
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const searchCategories = [
  {
    category: "Navegación",
    items: [
      { name: "Inicio", url: "/" },
      { name: "Inventario", url: "/inventory" },
      { name: "Módulos", url: "/modules" },
      { name: "Academia", url: "/academy" },
      { name: "Calendario", url: "/calendar" },
      { name: "Mensajes", url: "/messages" },
      { name: "Proveedores", url: "/suppliers" },
      { name: "Reportes", url: "/reports" },
      { name: "Cumplimiento", url: "/compliance" },
      { name: "Perfil", url: "/settings" },
    ],
  },
  {
    category: "Documentación",
    items: [
      { name: "Guía de economía circular", url: "/academy" },
      { name: "REP - Responsabilidad extendida del productor", url: "/compliance" },
      { name: "Cálculo de huella de carbono", url: "/academy" },
      { name: "Pasaportes digitales", url: "/modules" },
    ],
  },
  {
    category: "Soporte",
    items: [
      { name: "FAQ", url: "/academy" },
      { name: "Contacto", url: "/messages" },
      { name: "Centro de ayuda", url: "/academy" },
    ],
  },
];

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 right-[160px] z-50 bg-background/80 backdrop-blur-sm shadow-sm border-primary/20 hover:bg-primary/10 w-[200px] justify-start"
        onClick={() => setOpen(true)}
      >
        <BeLoopIcon name="search" className="mr-2" size={16} />
        <span>Buscar en BeLoop...</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar en BeLoop..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          {searchCategories.map((category) => (
            <CommandGroup key={category.category} heading={category.category}>
              {category.items.map((item) => (
                <CommandItem
                  key={item.name}
                  onSelect={() => handleSelect(item.url)}
                  className="cursor-pointer"
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
