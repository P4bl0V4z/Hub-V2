
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BeLoopIcon from '@/components/BeLoopIcons';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = "http://localhost:3001/api";

const DiagnosticCard = () => {
  const navigate = useNavigate();
  const [testStatus, setTestStatus] = useState<'loading' | 'not_started' | 'in_progress' | 'completed'>('loading');
  const [attemptInfo, setAttemptInfo] = useState<{ id: number; progress: number } | null>(null);

  // Cargar estado del test desde el backend
  useEffect(() => {
    const loadTestStatus = async () => {
      try {
        const token = localStorage.getItem('beloop_token');
        if (!token) {
          setTestStatus('not_started');
          return;
        }

        // Obtener todos los intentos del usuario
        const response = await fetch(`${API_BASE_URL}/attempts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setTestStatus('not_started');
          return;
        }

        const attempts = await response.json();

        if (!attempts || attempts.length === 0) {
          setTestStatus('not_started');
          return;
        }

        // Buscar intentos completados
        const completedAttempts = attempts.filter((a: any) => a.completed === true);
        const incompleteAttempts = attempts.filter((a: any) => a.completed === false);

        // Si hay intentos incompletos, mostrar el más reciente
        if (incompleteAttempts.length > 0) {
          const latest = incompleteAttempts.sort((a: any, b: any) => b.id - a.id)[0];
          const answeredCount = latest.progress?.answers?.length || 0;
          const totalQuestions = 20; // Aproximado, ajusta según tu flujo
          const progress = Math.round((answeredCount / totalQuestions) * 100);
          
          setTestStatus('in_progress');
          setAttemptInfo({ id: latest.id, progress });
          return;
        }

        // Si solo hay completados, mostrar como completado
        if (completedAttempts.length > 0) {
          const latest = completedAttempts.sort((a: any, b: any) => b.id - a.id)[0];
          setTestStatus('completed');
          setAttemptInfo({ id: latest.id, progress: 100 });
          return;
        }

        setTestStatus('not_started');
      } catch (error) {
        console.error('Error loading test status:', error);
        setTestStatus('not_started');
      }
    };

    loadTestStatus();
    
    // Actualizar cada 5 segundos para reflejar cambios
    const interval = setInterval(loadTestStatus, 5000);
    return () => clearInterval(interval);
  }, []);

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

                {testStatus === 'loading' && (
                  <p className="font-medium text-gray-400">Cargando...</p>
                )}

                {testStatus === 'not_started' && (
                  <p className="font-medium">No iniciado</p>
                )}

                {testStatus === 'in_progress' && (
                  <div className="space-y-1">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                      En progreso
                    </Badge>
                    {attemptInfo && attemptInfo.progress > 0 && (
                      <p className="text-xs text-gray-600">{attemptInfo.progress}% completado</p>
                    )}
                  </div>
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
                disabled={testStatus === 'loading'}
              >
                {testStatus === 'loading' && (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  </>
                )}

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
