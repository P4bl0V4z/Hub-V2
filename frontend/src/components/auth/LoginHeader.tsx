
import React from "react";

const LoginHeader: React.FC = () => {
  return (
    <div className="text-center">
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <span className="text-2xl font-bold text-primary-foreground">B</span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 text-black">BeLoop</h1>
      <p className="mt-2 text-xl font-medium text-muted-foreground mb-1">Trazabilidad de Ciclo de Vida de Productos</p>
      <p className="text-md text-muted-foreground">Controla la información de tus productos</p>
    </div>
  );
};

export default LoginHeader;
