import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, X, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface Milestone {
  name: string;
  status: "complete" | "partial" | "missing";
  description: string;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: "¿Cuántos productos diferentes comercializa su empresa?",
    options: ["Menos de 10", "Entre 10 y 50", "Entre 51 y 100", "Más de 100"],
  },
  {
    id: 2,
    question: "¿Qué tipo de productos vende principalmente su empresa?",
    options: ["Electrónicos", "Envases y embalajes", "Textiles", "Alimentos", "Otro"],
  },
  {
    id: 3,
    question: "¿Su empresa actualmente tiene algún sistema para gestionar el cumplimiento de la Ley REP?",
    options: ["Sí, un sistema completo", "Sí, pero es parcial", "No, pero estamos planificándolo", "No tenemos nada implementado"],
  },
  {
    id: 4,
    question: "¿Con qué GRANSIC están trabajando?",
    options: ["Envases y Embalajes", "Neumáticos", "Aceites Lubricantes", "Electrónicos", "Baterías", "Ninguno aún"],
  },
  {
    id: 5,
    question: "¿Cuántas personas en su organización necesitarán acceso al sistema?",
    options: ["1-5", "6-10", "11-20", "Más de 20"],
  },
  {
    id: 6,
    question: "¿Su empresa exporta productos a otros países?",
    options: ["Sí, regularmente", "Ocasionalmente", "No, solo mercado nacional"],
  },
  {
    id: 7,
    question: "¿Conoce los requerimientos de etiquetado para sus productos según la Ley REP?",
    options: ["Sí, completamente", "Sí, parcialmente", "No mucho", "No conozco"],
  },
];

// Planes de precios
const pricingPlans: Plan[] = [
  {
    id: 1,
    name: "Básico",
    price: "$149",
    period: "mensual",
    description: "Para empresas pequeñas que están comenzando con la gestión REP",
    features: [
      "Hasta 100 productos",
      "3 usuarios",
      "Reportes básicos",
      "Gestión de inventario",
      "Soporte por email"
    ],
    highlighted: false,
  },
  {
    id: 2,
    name: "Estándar",
    price: "$299",
    period: "mensual",
    description: "Para empresas medianas con necesidades de cumplimiento integral",
    features: [
      "Hasta 500 productos",
      "10 usuarios",
      "Reportes avanzados",
      "Gestión de inventario",
      "Trazabilidad completa",
      "Módulo de reportería REP",
      "Soporte prioritario"
    ],
    highlighted: true,
  },
  {
    id: 3,
    name: "Premium",
    price: "$599",
    period: "mensual",
    description: "Para grandes empresas con necesidades multinacionales",
    features: [
      "Productos ilimitados",
      "Usuarios ilimitados",
      "Reportes personalizados",
      "API completa",
      "Cumplimiento multinacional",
      "Módulos avanzados",
      "Consultoría dedicada",
      "Soporte 24/7"
    ],
    highlighted: false,
  }
];

const DiagnosticTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Milestones calculated based on answers (would be dynamic in a real app)
  const milestones: Milestone[] = [
    {
      name: "Inventario de productos",
      status: "complete",
      description: "Su empresa tiene un inventario completo de los productos que pone en el mercado."
    },
    {
      name: "Conocimiento de Ley REP",
      status: answers[7] === "Sí, completamente" ? "complete" : 
             answers[7] === "Sí, parcialmente" ? "partial" : "missing",
      description: "Conocimiento de los requerimientos normativos específicos para su sector."
    },
    {
      name: "Sistema de gestión REP",
      status: answers[3] === "Sí, un sistema completo" ? "complete" :
             answers[3] === "Sí, pero es parcial" ? "partial" : "missing",
      description: "Sistema para gestionar el cumplimiento de la Responsabilidad Extendida del Productor."
    },
    {
      name: "Trazabilidad de productos",
      status: "partial",
      description: "Sistema para rastrear productos a lo largo de su ciclo de vida."
    },
    {
      name: "Integración con GRANSIC",
      status: answers[4] === "Ninguno aún" ? "missing" : "partial",
      description: "Integración con sistemas colectivos de gestión."
    },
    {
      name: "Reportes regulatorios",
      status: "missing",
      description: "Capacidad para generar reportes para autoridades regulatorias."
    },
  ];

  const handleNext = () => {
    if (selectedOption === null) {
      toast({
        title: "Seleccione una opción",
        description: "Por favor seleccione una respuesta para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Save answer
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: selectedOption,
    });

    // Move to next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      // Test completed
      finishTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[questions[currentQuestion - 1].id] || null);
    }
  };

  const finishTest = () => {
    // Show success message
    toast({
      title: "Test completado",
      description: "Gracias por completar el test de diagnóstico.",
    });
    
    // Show results
    setTestCompleted(true);
  };

  const getStatusIcon = (status: string) => {
    if (status === "complete") {
      return <Check className="h-5 w-5 text-green-500" />;
    } else if (status === "partial") {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else {
      return <X className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    if (status === "complete") {
      return "Completado";
    } else if (status === "partial") {
      return "Parcial";
    } else {
      return "Pendiente";
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "complete") {
      return "bg-green-100 text-green-800";
    } else if (status === "partial") {
      return "bg-amber-100 text-amber-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  const handleSendEmail = () => {
    if (!emailValue || !emailValue.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor ingrese un email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    // Simulamos el envío
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Reporte enviado",
        description: `Se ha enviado el reporte de diagnóstico a ${emailValue}`,
      });
      setEmailValue("");
    }, 1500);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Test de Diagnóstico</h1>
            {!testCompleted ? (
              <p className="text-muted-foreground">
                Responda las siguientes preguntas para ayudarnos a entender mejor su negocio.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Resultados del análisis de su empresa y recomendaciones personalizadas.
              </p>
            )}
          </div>

          {!testCompleted ? (
            <>
              <div className="my-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Card className="border shadow-sm max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {questions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={selectedOption || ""} 
                    onValueChange={setSelectedOption}
                    className="space-y-3"
                  >
                    {questions[currentQuestion].options.map((option) => (
                      <div key={option} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer w-full">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      <BeLoopIcon name="chevronLeft" className="mr-2" size={16} />
                      Anterior
                    </Button>
                    <Button onClick={handleNext}>
                      {currentQuestion === questions.length - 1 ? "Finalizar" : "Siguiente"}
                      {currentQuestion === questions.length - 1 ? (
                        <BeLoopIcon name="check" className="ml-2" size={16} />
                      ) : (
                        <BeLoopIcon name="chevronRight" className="ml-2" size={16} />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="results">
                  <BeLoopIcon name="barChart2" className="mr-1" size={16} />
                  Resultados
                </TabsTrigger>
                <TabsTrigger value="solutions">
                  <BeLoopIcon name="lightbulb" className="mr-1" size={16} />
                  Soluciones Recomendadas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estado de Cumplimiento</CardTitle>
                      <CardDescription>
                        Basado en sus respuestas, hemos evaluado el estado de su empresa con respecto a los siguientes hitos clave.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {milestones.map((milestone, index) => (
                          <div key={index} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              {getStatusIcon(milestone.status)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{milestone.name}</h3>
                                <Badge className={getStatusColor(milestone.status)}>
                                  {getStatusText(milestone.status)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start">
                      <p className="text-sm text-muted-foreground mb-3">
                        Resumen de cumplimiento: 2 de 6 hitos completados (33%)
                      </p>
                      <Progress value={33} className="h-2 w-full mb-4" />
                      <Button onClick={() => navigate("/")}>
                        Volver al inicio
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recomendaciones Inmediatas</CardTitle>
                      <CardDescription>
                        Acciones prioritarias para mejorar su cumplimiento
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Implemente un sistema para la gestión integral de la Ley REP</li>
                        <li>Establezca integración con el GRANSIC correspondiente a su sector</li>
                        <li>Configure un sistema de reportes regulatorios para cumplimiento normativo</li>
                        <li>Mejore la trazabilidad de productos a lo largo de la cadena de suministro</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="solutions">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Planes Recomendados</CardTitle>
                      <CardDescription>
                        Basado en su perfil, estos son los planes que mejor se ajustan a sus necesidades
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {pricingPlans.map((plan) => (
                          <div 
                            key={plan.id} 
                            className={`border rounded-lg ${
                              plan.highlighted ? 'border-primary shadow-md ring-1 ring-primary' : ''
                            }`}
                          >
                            <div className="p-6">
                              <h3 className="text-lg font-medium mb-1">{plan.name}</h3>
                              <div className="flex items-end mb-4">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <span className="text-sm text-muted-foreground ml-1">/{plan.period}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                {plan.description}
                              </p>
                              <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                                Seleccionar plan
                              </Button>
                            </div>
                            <div className="bg-muted/50 p-6 border-t">
                              <ul className="space-y-2">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-center">
                                    <Check className="h-4 w-4 text-primary mr-2" />
                                    <span className="text-sm">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Módulos Recomendados</CardTitle>
                      <CardDescription>
                        Basado en sus respuestas, estos módulos ayudarán a cumplir con los hitos pendientes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Sistema de Gestión REP</h3>
                            <Badge>Recomendado</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Sistema integral para la gestión de responsabilidades extendidas del productor, con flujos de trabajo automatizados.
                          </p>
                          <Button size="sm" variant="outline">Ver detalles</Button>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Integración GRANSIC</h3>
                            <Badge>Crítico</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Conecte directamente con sistemas colectivos de gestión y reporte automáticamente sus obligaciones.
                          </p>
                          <Button size="sm" variant="outline">Ver detalles</Button>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Reportes Regulatorios</h3>
                            <Badge>Recomendado</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Generación automática de informes para cumplir con requisitos de las autoridades regulatorias.
                          </p>
                          <Button size="sm" variant="outline">Ver detalles</Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => navigate("/modules")}>
                        Ver todos los módulos
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Mail className="mr-2 h-5 w-5" />
                        Enviar por mail
                      </CardTitle>
                      <CardDescription>
                        Envíe este diagnóstico a su correo electrónico para compartirlo con su equipo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Recibirá un PDF con los resultados completos del diagnóstico y un video explicativo de las soluciones recomendadas.
                      </p>
                      
                      <div className="flex gap-3">
                        <Input 
                          type="email" 
                          placeholder="Ingrese su correo electrónico" 
                          className="flex-1"
                          value={emailValue}
                          onChange={(e) => setEmailValue(e.target.value)}
                        />
                        <Button onClick={handleSendEmail} disabled={isSending}>
                          {isSending ? "Enviando..." : "Enviar"}
                        </Button>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex flex-col gap-2">
                        <h4 className="font-medium">Contenido del reporte:</h4>
                        <ul className="space-y-1 pl-5 list-disc text-sm text-muted-foreground">
                          <li>Resultados completos del diagnóstico de cumplimiento</li>
                          <li>Análisis de brechas regulatorias identificadas</li>
                          <li>Recomendaciones personalizadas para su empresa</li>
                          <li>Detalles de planes y módulos sugeridos</li>
                          <li>Enlace a video explicativo con próximos pasos</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTest;
