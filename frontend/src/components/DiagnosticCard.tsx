
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeLoopIcon from '@/components/BeLoopIcons';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const STATE_KEY = "dt_state_v3";

const DiagnosticCard = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<any>(null);

  // Cargar estado del localStorage y actualizar periódicamente
  useEffect(() => {
    const loadState = () => {
      try {
        const raw = localStorage.getItem(STATE_KEY);
        if (raw) {
          setState(JSON.parse(raw));
        } else {
          setState(null);
        }
      } catch (error) {
        console.error('Error loading state:', error);
        setState(null);
      }
    };

    loadState();
    // Actualizar cada segundo para reflejar cambios en tiempo real
    const interval = setInterval(loadState, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determinar el estado del test
  const testStatus = useMemo(() => {
    if (!state) return 'not_started'; // No hay estado -> No iniciado
    if (state.finished === true) return 'completed'; // finished = true -> Completado
    return 'in_progress'; // Existe pero no completado -> En progreso
  }, [state]);

  const handleAction = () => {
    if (testStatus === 'completed') {
      navigate('/diagnostic/summary');
    } else {
      navigate('/diagnostic');
    }
  };

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-medium">Test de Diagnóstico</CardTitle>
          <BeLoopIcon name="flask-conical" className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estado del test</p>

                {testStatus === 'not_started' && (
                  <p className="font-medium">No iniciado</p>
                )}

                {testStatus === 'in_progress' && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    En progreso
                  </Badge>
                )}

                {testStatus === 'completed' && (
                  <Badge variant="default" className="bg-green-600">
                    Completado
                  </Badge>
                )}
              </div>

              <Button
                variant={testStatus === 'completed' ? 'default' : 'outline'}
                size="sm"
                className="gap-1"
                onClick={handleAction}
              >
                {testStatus === 'not_started' && (
                  <>
                    <BeLoopIcon name="play" className="h-4 w-4" />
                    Iniciar Test
                  </>
                )}

                {testStatus === 'in_progress' && (
                  <>
                    <BeLoopIcon name="arrow-right" className="h-4 w-4" />
                    Continuar Test
                  </>
                )}

                {testStatus === 'completed' && (
                  <>
                    <BeLoopIcon name="eye" className="h-4 w-4" />
                    Ver Resultados
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DiagnosticCard;
