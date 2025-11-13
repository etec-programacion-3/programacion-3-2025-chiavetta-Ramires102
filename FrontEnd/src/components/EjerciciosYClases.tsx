import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseCategory } from '../types';
import api from '../services/api.ts';

interface Clase {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  fecha_horario_al_que_va: string;
}

const EjerciciosYClases: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [clases, setClases] = useState<Clase[]>([]);
  const [loadingClases, setLoadingClases] = useState(true);

  useEffect(() => {
    cargarClases();
  }, []);

  const cargarClases = async () => {
    try {
      const response = await api.get('/clase');
      if (response.data && response.data.clases) {
        setClases(response.data.clases);
      }
    } catch (error) {
      console.error('Error cargando clases:', error);
    } finally {
      setLoadingClases(false);
    }
  };

  const formatearFecha = (fecha: string): string => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return fecha;
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

const exerciseCategories = [
    {
      id: 'upper',
      title: 'Ejercicios Parte Superior del Cuerpo',
      exercises: [
        // HOMBROS
        { id: 1, title: 'Press militar con mancuernas o barra', description: 'Fortalece deltoides y tríceps. Levanta el peso desde los hombros hasta la extensión completa por encima de la cabeza.', category: 'upper' },
        { id: 2, title: 'Elevaciones laterales', description: 'Trabaja los deltoides laterales. Con mancuernas, eleva los brazos hacia los lados hasta la altura de los hombros.', category: 'upper' },
        { id: 3, title: 'Elevaciones frontales', description: 'Enfoca en deltoides frontales. Levanta las mancuernas al frente hasta la altura de los hombros.', category: 'upper' },
        { id: 4, title: 'Pájaros o vuelos inversos', description: 'Para deltoides posteriores. Inclínate hacia adelante y eleva los brazos hacia los lados.', category: 'upper' },
        { id: 5, title: 'Plancha con toque de hombros', description: 'Activa hombros y core. En posición de plancha, toca alternativamente cada hombro con la mano opuesta.', category: 'upper' },
        // PECHO
        { id: 6, title: 'Flexiones (push-ups)', description: 'Clásico ejercicio de pecho, hombros y tríceps. Baja el cuerpo hasta casi tocar el suelo y empuja de vuelta.', category: 'upper' },
        { id: 7, title: 'Press de banca (barra o mancuernas)', description: 'Enfoca el pectoral mayor. Acostado en banco, baja el peso al pecho y empuja hacia arriba.', category: 'upper' },
        { id: 8, title: 'Aperturas con mancuernas (flyes)', description: 'Trabaja la apertura del pecho. Con brazos ligeramente flexionados, abre y cierra los brazos en forma de abrazo.', category: 'upper' },
        { id: 9, title: 'Flexiones inclinadas/declinadas', description: 'Varían el enfoque superior/inferior del pecho. Pies elevados para la parte superior, manos elevadas para la inferior.', category: 'upper' },
        { id: 10, title: 'Fondos en paralelas', description: 'Gran ejercicio para pecho y tríceps. Baja el cuerpo entre las barras paralelas y empuja hacia arriba.', category: 'upper' },
        // ESPALDA
        { id: 11, title: 'Dominadas o jalones al pecho', description: 'Fortalece dorsales y bíceps. Tira de tu cuerpo hacia arriba o jala la barra hacia el pecho.', category: 'upper' },
        { id: 12, title: 'Remo con barra o mancuernas', description: 'Trabaja todo el dorsal medio. Inclínate hacia adelante y jala el peso hacia tu abdomen.', category: 'upper' },
        { id: 13, title: 'Remo invertido (en barra baja o TRX)', description: 'Con peso corporal. Cuerpo inclinado bajo una barra, tira del pecho hacia ella.', category: 'upper' },
        { id: 14, title: 'Pull-over con mancuerna', description: 'Estira y activa el dorsal ancho. Acostado, lleva la mancuerna desde arriba de la cabeza hasta el pecho.', category: 'upper' },
        { id: 15, title: 'Superman en el suelo', description: 'Para zona lumbar y estabilidad. Boca abajo, eleva brazos y piernas simultáneamente.', category: 'upper' },
        // BRAZOS - Bíceps
        { id: 16, title: 'Curl con barra o mancuernas', description: 'Ejercicio fundamental para bíceps. Flexiona los codos llevando el peso hacia los hombros.', category: 'upper' },
        { id: 17, title: 'Curl martillo', description: 'Trabaja bíceps y antebrazo. Mancuernas en posición neutral, flexiona los codos.', category: 'upper' },
        { id: 18, title: 'Curl concentrado', description: 'Sentado, brazo apoyado en el muslo. Aísla el bíceps con movimiento controlado.', category: 'upper' },
        // BRAZOS - Tríceps
        { id: 19, title: 'Fondos en banco', description: 'Manos apoyadas en banco detrás de ti, baja y sube el cuerpo flexionando los codos.', category: 'upper' },
        { id: 20, title: 'Extensiones de tríceps sobre la cabeza', description: 'Con mancuerna o barra, extiende los brazos desde detrás de la cabeza.', category: 'upper' },
        { id: 21, title: 'Patada de tríceps con mancuernas', description: 'Inclinado, extiende el brazo hacia atrás manteniendo el codo fijo.', category: 'upper' },
        { id: 22, title: 'Flexiones con agarre cerrado', description: 'Manos juntas bajo el pecho, enfatiza el trabajo de tríceps.', category: 'upper' }
      ]
    },
    {
      id: 'lower',
      title: 'Ejercicios Parte Inferior del Cuerpo',
      exercises: [
        // CUÁDRICEPS
        { id: 23, title: 'Sentadillas (squats)', description: 'El clásico para todo el tren inferior. Baja flexionando rodillas y caderas, mantén la espalda recta.', category: 'lower' },
        { id: 24, title: 'Zancadas o lunges', description: 'Adelante, atrás o caminando. Da un paso largo y baja la rodilla trasera hacia el suelo.', category: 'lower' },
        { id: 25, title: 'Sentadilla búlgara', description: 'Pie trasero apoyado en un banco, enfoca una pierna. Gran ejercicio unilateral.', category: 'lower' },
        { id: 26, title: 'Prensa de piernas (leg press)', description: 'Muy buena para fuerza. Empuja la plataforma con los pies desde posición sentada.', category: 'lower' },
        { id: 27, title: 'Extensiones de piernas', description: 'En máquina, aísla el cuádriceps. Extiende las piernas desde posición sentada.', category: 'lower' },
        // GLÚTEOS
        { id: 28, title: 'Hip thrust', description: 'El mejor para glúteos. Elevaciones de cadera con barra o peso, espalda apoyada en banco.', category: 'lower' },
        { id: 29, title: 'Puente de glúteo (glute bridge)', description: 'Versión sin peso, ideal para principiantes. Acostado, eleva la cadera del suelo.', category: 'lower' },
        { id: 30, title: 'Peso muerto rumano', description: 'Trabaja glúteos y femorales. Baja la barra con piernas casi rectas, empuja cadera hacia atrás.', category: 'lower' },
        { id: 31, title: 'Patada de glúteo', description: 'En máquina o en suelo con banda. Aísla el glúteo mayor con extensión de cadera.', category: 'lower' },
        { id: 32, title: 'Monster walk o pasos laterales con banda', description: 'Con banda elástica en las rodillas, camina lateralmente manteniendo tensión.', category: 'lower' },
        // ISQUIOTIBIALES
        { id: 33, title: 'Peso muerto tradicional', description: 'Trabaja toda la cadena posterior. Levanta la barra del suelo con espalda recta.', category: 'lower' },
        { id: 34, title: 'Curl femoral', description: 'Acostado o sentado, con máquina o banda. Flexiona las piernas acercando talones a glúteos.', category: 'lower' },
        { id: 35, title: 'Buenos días (Good Mornings)', description: 'Con barra en hombros, inclina el torso hacia adelante manteniendo piernas casi rectas.', category: 'lower' },
        { id: 36, title: 'Puente de glúteo a una pierna', description: 'Variante unilateral que enfatiza isquiotibiales y glúteos.', category: 'lower' },
        { id: 37, title: 'Balanceo de piernas hacia atrás', description: 'De pie o en cuadrupedia, extiende la pierna hacia atrás con control.', category: 'lower' },
        // PANTORRILLAS
        { id: 38, title: 'Elevaciones de talones de pie (calf raises)', description: 'Eleva el cuerpo sobre las puntas de los pies, trabaja gemelos.', category: 'lower' },
        { id: 39, title: 'Elevaciones de talones sentado', description: 'En máquina o con peso. Enfoca el sóleo (parte interna de la pantorrilla).', category: 'lower' },
        { id: 40, title: 'Saltos en el lugar', description: 'Jump rope o pliometría. Trabajo dinámico de pantorrillas y cardio.', category: 'lower' },
        { id: 41, title: 'Subir escalones (step-ups)', description: 'Con énfasis en el empuje del pie. Sube a un banco impulsándote con una pierna.', category: 'lower' }
      ]
    },
    {
      id: 'abs',
      title: 'Ejercicios de Abdomen',
      exercises: [
        // ABDOMEN SUPERIOR
        { id: 42, title: 'Crunch tradicional', description: 'Acortamiento del recto abdominal. Acostado, eleva el torso contrayendo el abdomen.', category: 'abs' },
        { id: 43, title: 'Crunch con piernas elevadas', description: 'Aumenta la intensidad. Mantén piernas en el aire mientras haces el crunch.', category: 'abs' },
        { id: 44, title: 'Crunch en fitball', description: 'Mayor rango de movimiento. Usa pelota suiza para apoyo lumbar.', category: 'abs' },
        { id: 45, title: 'Abmat sit-up', description: 'Versión completa del crunch, suelo o con apoyo lumbar para mayor recorrido.', category: 'abs' },
        { id: 46, title: 'Toques de talones', description: 'Activa el abdomen superior y los oblicuos. Acostado, toca alternativamente cada talón.', category: 'abs' },
        // ABDOMEN INFERIOR
        { id: 47, title: 'Elevaciones de piernas acostado', description: 'Trabaja desde la pelvis hacia arriba. Eleva piernas rectas desde el suelo.', category: 'abs' },
        { id: 48, title: 'Elevaciones de piernas colgado', description: 'Muy completo. Colgado de barra, eleva las rodillas o piernas hacia el pecho.', category: 'abs' },
        { id: 49, title: 'Reverse crunch', description: 'Excelente para la parte baja. Lleva las rodillas hacia el pecho elevando la cadera.', category: 'abs' },
        { id: 50, title: 'Flutter kicks (patadas cortas)', description: 'Activa toda la zona baja. Piernas extendidas, movimiento alternado arriba y abajo.', category: 'abs' },
        { id: 51, title: 'Scissor kicks (tijeras)', description: 'Similar a flutter kicks, con cruce alternado de piernas.', category: 'abs' },
        // OBLICUOS
        { id: 52, title: 'Russian twists', description: 'Con o sin peso. Torsión controlada del tronco sentado con pies elevados.', category: 'abs' },
        { id: 53, title: 'Side plank (plancha lateral)', description: 'Trabaja oblicuos y estabilidad. Apoyado en antebrazo lateral, mantén cuerpo recto.', category: 'abs' },
        { id: 54, title: 'Bicicleta', description: 'Alternando codo y rodilla. Dinámico y eficaz, simula pedaleo acostado.', category: 'abs' },
        { id: 55, title: 'Woodchoppers', description: 'En cable o con mancuerna. Simula un giro diagonal de cortar madera.', category: 'abs' },
        { id: 56, title: 'Mountain climbers cruzados', description: 'Activa oblicuos y cardio. Lleva rodilla hacia codo opuesto en plancha.', category: 'abs' },
        // CORE PROFUNDO
        { id: 57, title: 'Plancha frontal (plank)', description: 'Base del entrenamiento de core. Mantén cuerpo recto apoyado en antebrazos.', category: 'abs' },
        { id: 58, title: 'Plancha con elevación de pierna o brazo', description: 'Variante que aumenta inestabilidad y trabajo del core.', category: 'abs' },
        { id: 59, title: 'Plancha lateral con apoyo de codo', description: 'Fortalece oblicuos y estabilizadores laterales.', category: 'abs' },
        { id: 60, title: 'Dead bug (bicho muerto)', description: 'Gran control y coordinación. Acostado, mueve brazos y piernas opuestas.', category: 'abs' },
        { id: 61, title: 'Bird dog', description: 'Desde posición cuadrúpeda. Extiende brazo y pierna opuesta, fortalece zona central.', category: 'abs' },
        // COMBINADOS
        { id: 62, title: 'V-ups', description: 'Subís piernas y tronso al mismo tiempo formando una V. Muy completo.', category: 'abs' },
        { id: 63, title: 'Rollout con rueda abdominal', description: 'Muy potente para todo el core. Rueda hacia adelante y regresa con control.', category: 'abs' },
        { id: 64, title: 'Plank jacks', description: 'Plancha + movimiento de piernas. Abre y cierra piernas como salto desde plancha.', category: 'abs' },
        { id: 65, title: 'Sit-ups con giro', description: 'Trabaja recto abdominal y oblicuos. Gira el torso al subir tocando codo con rodilla opuesta.', category: 'abs' },
        { id: 66, title: 'Hollow hold (posición de barquito)', description: 'Isométrico y exigente. Mantén cuerpo en forma de banana elevado del suelo.', category: 'abs' }
      ]
    }
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            💪 Ejercicios y Clases
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', padding: '40px', gap: '30px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Left Side - Exercises with Scrollable Container */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '900px', overflowY: 'auto', paddingRight: '10px' }}>
          {exerciseCategories.map((category) => (
            <div key={category.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'opacity 0.2s'
                }}
                onClick={() => toggleCategory(category.id)}
              >
                <span style={{ fontSize: '20px', fontWeight: 600 }}>{category.title}</span>
                <span style={{ fontSize: '20px', transition: 'transform 0.3s' }}>
                  {expandedCategories.has(category.id) ? '▼' : '▶'}
                </span>
              </div>
              <div style={{
                maxHeight: expandedCategories.has(category.id) ? '600px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}>
                {category.exercises.map((exercise) => (
                  <div key={exercise.id} style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', color: '#333' }}>
                      {exercise.title}
                    </div>
                    <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Calendar with Classes */}
        <div style={{ flex: '1', background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', height: 'fit-content', position: 'sticky', top: '20px', maxHeight: '900px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '28px', color: '#667eea', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
            📅 Calendario de Clases
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {loadingClases ? (
              <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '20px', textAlign: 'center', color: '#999' }}>
                Cargando clases...
              </div>
            ) : clases && clases.length > 0 ? (
              clases.map((clase) => (
                <div key={clase.id} style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '10px',
                  padding: '15px',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  minHeight: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700 }}>
                      {clase.nombre}
                    </h3>
                    <p style={{ margin: '0 0 5px 0', fontSize: '13px', opacity: 0.95 }}>
                      ⏱️ Duración: {clase.duracion} min
                    </p>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '15px',
                    fontSize: '11px',
                    opacity: 0.85,
                    textAlign: 'right',
                    fontWeight: 500
                  }}>
                    � {formatearFecha(clase.fecha_horario_al_que_va)}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '20px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}>📆</div>
                <p style={{ color: '#999', textAlign: 'center', fontSize: '16px' }}>
                  No hay clases programadas en este momento
                </p>
                <p style={{ color: '#ccc', textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>
                  Las clases aparecerán aquí cuando estén disponibles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EjerciciosYClases;