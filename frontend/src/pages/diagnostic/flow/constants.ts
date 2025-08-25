// -----------------------------------------------------------------------------
// Complejidad estructural: constantes/ayudantes
// -----------------------------------------------------------------------------
export type ComplexityLevel = "basica" | "intermedia" | "avanzada" | "compleja";

export const LEVELS: Record<ComplexityLevel, { label: string; factor: number }> = {
  basica:     { label: "Básica",     factor: 1.0 },
  intermedia: { label: "Intermedia", factor: 1.5 },
  avanzada:   { label: "Avanzada",   factor: 2.5 },
  compleja:   { label: "Compleja",   factor: 4.0 },
};

// Ponderaciones de la tabla (deben sumar 1.0)
export const COMPLEXITY_WEIGHTS = {
  familias:     0.10,
  lineas:       0.15,
  categorias:   0.15,
  skus:         0.20,
  niveles:      0.15,
  componentes:  0.25,
} as const;

// Umbrales para mapear el score (1.00–4.00) → nivel
export const THRESHOLDS = {
  basicaMax: 1.75, // [1.00, 1.75)
  interMax:  2.25, // [1.75, 2.25)
  avzMax:    3.25, // [2.25, 3.25)
  // >= 3.25 => "compleja"
};
