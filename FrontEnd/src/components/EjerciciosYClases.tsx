import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseCategory } from '../types';
import api from '../services/api.ts';

interface Clase {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: string;
  fecha_horario_al_que_va: string;
}

const EjerciciosYClases: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [classes, setClasses] = useState<Clase[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [selectedClase, setSelectedClase] = useState<Clase | null>(null);
  const [showAllClases, setShowAllClases] = useState(false);

  useEffect(() => {
    const loadClases = async () => {
      try {
        console.log('🔄 Iniciando carga de clases desde /clase...');
        const response = await api.get('/clase');
        console.log('✅ Respuesta recibida del servidor');
        console.log('   - Status:', response.status);
        console.log('   - Data type:', typeof response.data);
        console.log('   - Is Array:', Array.isArray(response.data));
        console.log('   - Data completa:', response.data);
        
        const data = response.data;
        
        let clasesList: Clase[] = [];
        
        if (Array.isArray(data)) {
          console.log('✓ Response es un array directo, cantidad:', data.length);
          clasesList = data as Clase[];
        } else if (data && Array.isArray(data.clases)) {
          console.log('✓ Data.clases es array, cantidad:', data.clases.length);
          clasesList = data.clases as Clase[];
        } else if (data && Array.isArray(data.results)) {
          console.log('✓ Data.results es array, cantidad:', data.results.length);
          clasesList = data.results as Clase[];
        } else if (data && data.data && Array.isArray(data.data)) {
          console.log('✓ Data.data es array, cantidad:', data.data.length);
          clasesList = data.data as Clase[];
        } else {
          console.warn('⚠️ No se encontró formato reconocido para clases');
          console.log('   Keys disponibles:', Object.keys(data));
        }
        
        console.log('📊 Clases cargadas:', clasesList.length);
        clasesList.forEach((c, idx) => {
          console.log(`   [${idx}] nombre="${c.nombre}", fecha="${c.fecha_horario_al_que_va}"`);
        });
        
        setClasses(clasesList);
      } catch (error: any) {
        console.error('❌ Error cargando clases:', error.message);
        console.error('   Status:', error.response?.status);
        console.error('   Data:', error.response?.data);
        console.error('   Error completo:', error);
        setClasses([]);
      }
    };

    loadClases();
  }, []);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const exerciseCategories: ExerciseCategory[] = [
  {
    id: 'upper',
    title: 'Parte Superior del Cuerpo',
    exercises: [
      // HOMBROS
      {
        id: 1,
        title: 'Press militar con mancuernas o barra',
        description: 'Fortalece deltoides y tríceps. Levanta el peso desde los hombros hasta la extensión completa por encima de la cabeza, manteniendo el core activado y la espalda recta.',
        videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI',
        category: 'upper'
      },
      {
        id: 2,
        title: 'Elevaciones laterales',
        description: 'Trabaja los deltoides laterales. Con mancuernas a los lados, eleva los brazos hacia los lados hasta la altura de los hombros, manteniendo una ligera flexión en los codos.',
        videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
        category: 'upper'
      },
      {
        id: 3,
        title: 'Elevaciones frontales',
        description: 'Enfoca en deltoides frontales. Levanta las mancuernas al frente hasta la altura de los hombros, alternando o simultáneamente, controlando el movimiento.',
        videoUrl: 'https://www.youtube.com/embed/2lGA7Ce89e8',
        category: 'upper'
      },
      {
        id: 4,
        title: 'Pájaros o vuelos inversos',
        description: 'Para deltoides posteriores. Inclínate hacia adelante con la espalda recta y eleva los brazos hacia los lados, enfocándote en los hombros traseros.',
        videoUrl: 'https://www.youtube.com/embed/T7gWBKwmUek',
        category: 'upper'
      },
      {
        id: 5,
        title: 'Plancha con toque de hombros',
        description: 'Activa hombros y core. En posición de plancha alta, toca alternativamente cada hombro con la mano opuesta sin rotar las caderas.',
        videoUrl: 'https://www.youtube.com/embed/H8j0Qh3i6-s',
        category: 'upper'
      },
      // PECHO
      {
        id: 6,
        title: 'Flexiones (push-ups)',
        description: 'Clásico ejercicio de pecho, hombros y tríceps. Baja el cuerpo hasta casi tocar el suelo manteniendo el cuerpo recto y empuja de vuelta.',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        category: 'upper'
      },
      {
        id: 7,
        title: 'Press de banca (barra o mancuernas)',
        description: 'Enfoca el pectoral mayor. Acostado en banco, baja el peso controladamente al pecho y empuja hacia arriba hasta extender los brazos completamente.',
        videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
        category: 'upper'
      },
      {
        id: 8,
        title: 'Aperturas con mancuernas (flyes)',
        description: 'Trabaja la apertura del pecho. Con brazos ligeramente flexionados, abre y cierra los brazos en forma de abrazo, sintiendo el estiramiento pectoral.',
        videoUrl: 'https://www.youtube.com/embed/eozdVDA78K0',
        category: 'upper'
      },
      {
        id: 9,
        title: 'Flexiones inclinadas/declinadas',
        description: 'Varían el enfoque superior/inferior del pecho. Pies elevados para trabajar pecho superior, manos elevadas para pecho inferior.',
        videoUrl: 'https://www.youtube.com/embed/cfbNhEmP-qM',
        category: 'upper'
      },
      {
        id: 10,
        title: 'Fondos en paralelas',
        description: 'Gran ejercicio para pecho y tríceps. Baja el cuerpo entre las barras paralelas flexionando los codos y empuja hacia arriba con fuerza.',
        videoUrl: 'https://www.youtube.com/embed/2z8JmcrW-As',
        category: 'upper'
      },
      // ESPALDA
      {
        id: 11,
        title: 'Dominadas o jalones al pecho',
        description: 'Fortalece dorsales y bíceps. Tira de tu cuerpo hacia arriba hasta que la barbilla supere la barra, o jala la barra hacia el pecho en máquina.',
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
        category: 'upper'
      },
      {
        id: 12,
        title: 'Remo con barra o mancuernas',
        description: 'Trabaja todo el dorsal medio. Inclínate hacia adelante con la espalda recta y jala el peso hacia tu abdomen, apretando los omóplatos.',
        videoUrl: 'https://www.youtube.com/embed/kBWAon7ItDw',
        category: 'upper'
      },
      {
        id: 13,
        title: 'Remo invertido (en barra baja o TRX)',
        description: 'Con peso corporal. Cuerpo inclinado bajo una barra, tira del pecho hacia ella manteniendo el cuerpo recto como una plancha.',
        videoUrl: 'https://www.youtube.com/embed/hXTc1mDnZCw',
        category: 'upper'
      },
      {
        id: 14,
        title: 'Pull-over con mancuerna',
        description: 'Estira y activa el dorsal ancho. Acostado, lleva la mancuerna desde arriba de la cabeza hasta el pecho con los brazos extendidos.',
        videoUrl: 'https://www.youtube.com/embed/zkU6Ok44055',
        category: 'upper'
      },
      {
        id: 15,
        title: 'Superman en el suelo',
        description: 'Para zona lumbar y estabilidad. Boca abajo, eleva brazos y piernas simultáneamente del suelo, manteniendo la posición unos segundos.',
        videoUrl: 'https://www.youtube.com/embed/cc6UVRS7PW4',
        category: 'upper'
      },
      // BRAZOS - Bíceps
      {
        id: 16,
        title: 'Curl con barra o mancuernas',
        description: 'Ejercicio fundamental para bíceps. Flexiona los codos llevando el peso hacia los hombros, manteniendo los codos fijos a los costados.',
        videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
        category: 'upper'
      },
      {
        id: 17,
        title: 'Curl martillo',
        description: 'Trabaja bíceps y antebrazo. Mancuernas en posición neutral (palmas enfrentadas), flexiona los codos manteniendo esa posición.',
        videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4',
        category: 'upper'
      },
      {
        id: 18,
        title: 'Curl concentrado',
        description: 'Sentado, brazo apoyado en el muslo. Aísla el bíceps con movimiento controlado, enfocándote en la contracción máxima.',
        videoUrl: 'https://www.youtube.com/embed/Jvj2wV0vOYU',
        category: 'upper'
      },
      // BRAZOS - Tríceps
      {
        id: 19,
        title: 'Fondos en banco',
        description: 'Manos apoyadas en banco detrás de ti, baja y sube el cuerpo flexionando los codos, manteniendo los codos cerca del cuerpo.',
        videoUrl: 'https://www.youtube.com/embed/6kALZikXxLc',
        category: 'upper'
      },
      {
        id: 20,
        title: 'Extensiones de tríceps sobre la cabeza',
        description: 'Con mancuerna o barra, extiende los brazos desde detrás de la cabeza hasta arriba, manteniendo los codos fijos y apuntando al techo.',
        videoUrl: 'https://www.youtube.com/embed/YbX7Wd8jQ-Q',
        category: 'upper'
      },
      {
        id: 21,
        title: 'Patada de tríceps con mancuernas',
        description: 'Inclinado hacia adelante, extiende el brazo hacia atrás manteniendo el codo fijo a la altura del torso, contrayendo el tríceps.',
        videoUrl: 'https://www.youtube.com/embed/6SS6K3lAwZ8',
        category: 'upper'
      },
      {
        id: 22,
        title: 'Flexiones con agarre cerrado',
        description: 'Manos juntas bajo el pecho formando un diamante, enfatiza el trabajo de tríceps. Baja hasta casi tocar el suelo.',
        videoUrl: 'https://www.youtube.com/embed/_4EGPVJuqfA',
        category: 'upper'
      }
    ]
  },
  {
    id: 'lower',
    title: 'Parte Inferior del Cuerpo',
    exercises: [
      // CUÁDRICEPS
      {
        id: 23,
        title: 'Sentadillas (squats)',
        description: 'El clásico para todo el tren inferior. Baja flexionando rodillas y caderas hasta que los muslos estén paralelos al suelo, mantén la espalda recta y el pecho arriba.',
        videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
        category: 'lower'
      },
      {
        id: 24,
        title: 'Zancadas o lunges',
        description: 'Adelante, atrás o caminando. Da un paso largo y baja la rodilla trasera hacia el suelo, mantén el torso erguido y el peso en el talón delantero.',
        videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
        category: 'lower'
      },
      {
        id: 25,
        title: 'Sentadilla búlgara',
        description: 'Pie trasero apoyado en un banco, enfoca una pierna. Gran ejercicio unilateral para desarrollar equilibrio y fuerza en cada pierna.',
        videoUrl: 'https://www.youtube.com/embed/2C-uSHbkBF0',
        category: 'lower'
      },
      {
        id: 26,
        title: 'Prensa de piernas (leg press)',
        description: 'Muy buena para fuerza. Empuja la plataforma con los pies desde posición sentada, extendiendo las piernas sin bloquear las rodillas.',
        videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ',
        category: 'lower'
      },
      {
        id: 27,
        title: 'Extensiones de piernas',
        description: 'En máquina, aísla el cuádriceps. Extiende las piernas desde posición sentada, contrayendo el cuádriceps en la parte superior del movimiento.',
        videoUrl: 'https://www.youtube.com/embed/YyvSfVjQeL0',
        category: 'lower'
      },
      // GLÚTEOS
      {
        id: 28,
        title: 'Hip thrust',
        description: 'El mejor para glúteos. Elevaciones de cadera con barra o peso, espalda apoyada en banco. Empuja la cadera hacia arriba apretando los glúteos.',
        videoUrl: 'https://www.youtube.com/embed/SEdqd1n0cvg',
        category: 'lower'
      },
      {
        id: 29,
        title: 'Puente de glúteo (glute bridge)',
        description: 'Versión sin peso, ideal para principiantes. Acostado boca arriba, eleva la cadera del suelo apretando los glúteos en la parte superior.',
        videoUrl: 'https://www.youtube.com/embed/wPM8icPu6H8',
        category: 'lower'
      },
      {
        id: 30,
        title: 'Peso muerto rumano',
        description: 'Trabaja glúteos y femorales. Baja la barra con piernas casi rectas, empuja la cadera hacia atrás y siente el estiramiento en los femorales.',
        videoUrl: 'https://www.youtube.com/embed/2SHsk9AzdjA',
        category: 'lower'
      },
      {
        id: 31,
        title: 'Patada de glúteo',
        description: 'En máquina o en suelo con banda. Aísla el glúteo mayor con extensión de cadera, manteniendo la rodilla flexionada.',
        videoUrl: 'https://www.youtube.com/embed/SYJv8f40zbc',
        category: 'lower'
      },
      {
        id: 32,
        title: 'Monster walk o pasos laterales con banda',
        description: 'Con banda elástica en las rodillas o tobillos, camina lateralmente manteniendo tensión constante y posición semi-agachada.',
        videoUrl: 'https://www.youtube.com/embed/Nho2JMMIAVE',
        category: 'lower'
      },
      // ISQUIOTIBIALES
      {
        id: 33,
        title: 'Peso muerto tradicional',
        description: 'Trabaja toda la cadena posterior. Levanta la barra del suelo con espalda recta, extendiendo caderas y rodillas simultáneamente.',
        videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
        category: 'lower'
      },
      {
        id: 34,
        title: 'Curl femoral',
        description: 'Acostado o sentado, con máquina o banda. Flexiona las piernas acercando talones a glúteos, contrayendo los femorales.',
        videoUrl: 'https://www.youtube.com/embed/1Tq3QdYUuHs',
        category: 'lower'
      },
      {
        id: 35,
        title: 'Buenos días (Good Mornings)',
        description: 'Con barra en hombros, inclina el torso hacia adelante manteniendo piernas casi rectas y espalda recta, siente el estiramiento femoral.',
        videoUrl: 'https://www.youtube.com/embed/YA-h3n9L4YU',
        category: 'lower'
      },
      {
        id: 36,
        title: 'Puente de glúteo a una pierna',
        description: 'Variante unilateral que enfatiza isquiotibiales y glúteos. Una pierna extendida mientras elevas la cadera con la otra.',
        videoUrl: 'https://www.youtube.com/embed/AVAXhy6pl7o',
        category: 'lower'
      },
      {
        id: 37,
        title: 'Balanceo de piernas hacia atrás',
        description: 'De pie o en cuadrupedia, extiende la pierna hacia atrás con control, manteniendo la espalda estable y contrayendo el glúteo.',
        videoUrl: 'https://www.youtube.com/embed/SFDWHBFQBuY',
        category: 'lower'
      },
      // PANTORRILLAS
      {
        id: 38,
        title: 'Elevaciones de talones de pie (calf raises)',
        description: 'Eleva el cuerpo sobre las puntas de los pies, trabaja gemelos. Puede hacerse con peso o sin él, en escalón para mayor rango.',
        videoUrl: 'https://www.youtube.com/embed/gwLzBJYoWlI',
        category: 'lower'
      },
      {
        id: 39,
        title: 'Elevaciones de talones sentado',
        description: 'En máquina o con peso sobre las rodillas. Enfoca el sóleo (parte interna de la pantorrilla), elevando los talones desde posición sentada.',
        videoUrl: 'https://www.youtube.com/embed/JbyjNymZOt0',
        category: 'lower'
      },
      {
        id: 40,
        title: 'Saltos en el lugar',
        description: 'Jump rope o pliometría. Trabajo dinámico de pantorrillas y cardio, saltando sobre las puntas de los pies con rebote explosivo.',
        videoUrl: 'https://www.youtube.com/embed/FApFLE4HyYo',
        category: 'lower'
      },
      {
        id: 41,
        title: 'Subir escalones (step-ups)',
        description: 'Con énfasis en el empuje del pie. Sube a un banco o escalón impulsándote con una pierna, empujando desde el talón y la punta.',
        videoUrl: 'https://www.youtube.com/embed/dQqApCGd5Ss',
        category: 'lower'
      }
    ]
  },
  {
    id: 'abs',
    title: 'Abdomen',
    exercises: [
      // ABDOMEN SUPERIOR
      {
        id: 42,
        title: 'Crunch tradicional',
        description: 'Acortamiento del recto abdominal. Acostado con rodillas flexionadas, eleva el torso contrayendo el abdomen sin jalar el cuello.',
        videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU',
        category: 'abs'
      },
      {
        id: 43,
        title: 'Crunch con piernas elevadas',
        description: 'Aumenta la intensidad. Mantén piernas en el aire en ángulo de 90 grados mientras haces el crunch, mayor activación abdominal.',
        videoUrl: 'https://www.youtube.com/embed/NGvlBt72q6E',
        category: 'abs'
      },
      {
        id: 44,
        title: 'Crunch en fitball',
        description: 'Mayor rango de movimiento. Usa pelota suiza para apoyo lumbar, permitiendo mayor extensión y contracción del abdomen.',
        videoUrl: 'https://www.youtube.com/embed/DLN-KHgufIo',
        category: 'abs'
      },
      {
        id: 45,
        title: 'Abmat sit-up',
        description: 'Versión completa del crunch, suelo o con apoyo lumbar para mayor recorrido. Lleva el torso desde extensión completa hasta sentado.',
        videoUrl: 'https://www.youtube.com/embed/qCL8FvQរីីី4',
        category: 'abs'
      },
      {
        id: 46,
        title: 'Toques de talones',
        description: 'Activa el abdomen superior y los oblicuos. Acostado con torso elevado, toca alternativamente cada talón deslizando las manos.',
        videoUrl: 'https://www.youtube.com/embed/OFjpR-jzYDg',
        category: 'abs'
      },
      // ABDOMEN INFERIOR
      {
        id: 47,
        title: 'Elevaciones de piernas acostado',
        description: 'Trabaja desde la pelvis hacia arriba. Eleva piernas rectas desde el suelo hasta 90 grados, controlando el descenso.',
        videoUrl: 'https://www.youtube.com/embed/JB2oyawG9KI',
        category: 'abs'
      },
      {
        id: 48,
        title: 'Elevaciones de piernas colgado',
        description: 'Muy completo. Colgado de barra, eleva las rodillas hacia el pecho o piernas rectas para mayor dificultad.',
        videoUrl: 'https://www.youtube.com/embed/hdng3Nm1x_E',
        category: 'abs'
      },
      {
        id: 49,
        title: 'Reverse crunch',
        description: 'Excelente para la parte baja. Lleva las rodillas hacia el pecho elevando la cadera del suelo, contrayendo el abdomen inferior.',
        videoUrl: 'https://www.youtube.com/embed/5nPnATGxgDk',
        category: 'abs'
      },
      {
        id: 50,
        title: 'Flutter kicks (patadas cortas)',
        description: 'Activa toda la zona baja. Piernas extendidas ligeramente elevadas, movimiento alternado arriba y abajo como nadando.',
        videoUrl: 'https://www.youtube.com/embed/ANVdMMpSPD4',
        category: 'abs'
      },
      {
        id: 51,
        title: 'Scissor kicks (tijeras)',
        description: 'Similar a flutter kicks, con cruce alternado de piernas. Una pierna sube mientras la otra baja, cruzándose en el medio.',
        videoUrl: 'https://www.youtube.com/embed/ckXavE71VTo',
        category: 'abs'
      },
      // OBLICUOS
      {
        id: 52,
        title: 'Russian twists',
        description: 'Con o sin peso. Sentado con torso inclinado y pies elevados, gira el torso de lado a lado tocando el suelo con las manos.',
        videoUrl: 'https://www.youtube.com/embed/wkD8rjkodUI',
        category: 'abs'
      },
      {
        id: 53,
        title: 'Side plank (plancha lateral)',
        description: 'Trabaja oblicuos y estabilidad. Apoyado en antebrazo lateral, mantén cuerpo recto en línea desde pies hasta cabeza.',
        videoUrl: 'https://www.youtube.com/embed/K2VljzCC16g',
        category: 'abs'
      },
      {
        id: 54,
        title: 'Bicicleta',
        description: 'Alternando codo y rodilla. Dinámico y eficaz, simula pedaleo acostado llevando codo hacia rodilla opuesta.',
        videoUrl: 'https://www.youtube.com/embed/9FGilxCbdz8',
        category: 'abs'
      },
      {
        id: 55,
        title: 'Woodchoppers',
        description: 'En cable o con mancuerna. Simula un giro diagonal de cortar madera, rotando el torso desde arriba hacia abajo en diagonal.',
        videoUrl: 'https://www.youtube.com/embed/pAplQXk3dkU',
        category: 'abs'
      },
      {
        id: 56,
        title: 'Mountain climbers cruzados',
        description: 'Activa oblicuos y cardio. En posición de plancha, lleva rodilla hacia codo opuesto alternadamente con ritmo dinámico.',
        videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM',
        category: 'abs'
      },
      // CORE PROFUNDO
      {
        id: 57,
        title: 'Plancha frontal (plank)',
        description: 'Base del entrenamiento de core. Mantén cuerpo recto apoyado en antebrazos y puntas de pies, contrayendo abdomen.',
        videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
        category: 'abs'
      },
      {
        id: 58,
        title: 'Plancha con elevación de pierna o brazo',
        description: 'Variante que aumenta inestabilidad y trabajo del core. Desde plancha, eleva alternadamente un brazo o pierna.',
        videoUrl: 'https://www.youtube.com/embed/AeF5Qtz_6bs',
        category: 'abs'
      },
      {
        id: 59,
        title: 'Plancha lateral con apoyo de codo',
        description: 'Fortalece oblicuos y estabilizadores laterales. Cuerpo en línea recta apoyado en un antebrazo lateral.',
        videoUrl: 'https://www.youtube.com/embed/wqzrb67Dwf8',
        category: 'abs'
      },
      {
        id: 60,
        title: 'Dead bug (bicho muerto)',
        description: 'Gran control y coordinación. Acostado, mueve brazos y piernas opuestas extendiendo y flexionando sin arquear la espalda.',
        videoUrl: 'https://www.youtube.com/embed/4XLEnwUr1d8',
        category: 'abs'
      },
      {
        id: 61,
        title: 'Bird dog',
        description: 'Desde posición cuadrúpeda en cuatro apoyos. Extiende brazo y pierna opuesta simultáneamente, fortalece zona central sin impacto.',
        videoUrl: 'https://www.youtube.com/embed/wiFNA3sqjCA',
        category: 'abs'
      },
      // COMBINADOS
      {
        id: 62,
        title: 'V-ups',
        description: 'Levanta piernas y torso al mismo tiempo formando una V. Muy completo, toca las puntas de los pies con las manos en el aire.',
        videoUrl: 'https://www.youtube.com/embed/7UVgs18Y1P4',
        category: 'abs'
      },
      {
        id: 63,
        title: 'Rollout con rueda abdominal',
        description: 'Muy potente para todo el core. Desde rodillas o de pie, rueda hacia adelante extendiendo el cuerpo y regresa con control.',
        videoUrl: 'https://www.youtube.com/embed/gY5cT3zSL-o',
        category: 'abs'
      },
      {
        id: 64,
        title: 'Plank jacks',
        description: 'Plancha + movimiento de piernas. Desde posición de plancha, abre y cierra piernas saltando como jumping jacks.',
        videoUrl: 'https://www.youtube.com/embed/8kyFEBHY5Tg',
        category: 'abs'
      },
      {
        id: 65,
        title: 'Sit-ups con giro',
        description: 'Trabaja recto abdominal y oblicuos. Haz un sit-up completo y al subir gira el torso tocando codo con rodilla opuesta.',
        videoUrl: 'https://www.youtube.com/embed/SIj5dRzALKo',
        category: 'abs'
      },
      {
        id: 66,
        title: 'Hollow hold (posición de barquito)',
        description: 'Isométrico y exigente. Mantén cuerpo en forma de banana con brazos y piernas elevados del suelo, espalda baja pegada al piso.',
        videoUrl: 'https://www.youtube.com/embed/LlDNef_Ztsc',
        category: 'abs'
      }
    ]
  }
];

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "var(--bg-gradient)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: 'var(--overlay)',
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
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text)', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            💪 Ejercicios y Clases
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', padding: '40px', gap: '40px', maxWidth: '12000px', margin: '0 auto' }}>
        {/* Left Side - Exercises */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {exerciseCategories.map((category) => (
            <div key={category.id} style={{ background: 'var(--card-bg)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                  color: 'var(--text)',
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
                maxHeight: expandedCategories.has(category.id) ? '1000px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}>
                <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {category.exercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => setSelectedExercise(exercise)}
                      style={{
                        padding: '15px 20px',
                        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
                        color: 'var(--text)',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        textAlign: 'center',
                        flex: '1 1 calc(50% - 6px)',
                        minWidth: '200px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {exercise.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Calendar (carga clases desde API) */}
        <div style={{ flex: '1', background: 'var(--card-bg)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--accent)', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
            📅 Calendario de Clases
          </h2>

          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '20px', minHeight: '200px' }}>
            {classes.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>📆</div>
                <p style={{ color: '#999', textAlign: 'center', fontSize: '16px' }}>
                  No hay clases programadas en este momento
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {classes.slice(0, 8).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClase(c)}
                    style={{
                      padding: '18px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</div>
                    </div>
                    <div style={{ fontSize: '14px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                      {c.fecha_horario_al_que_va}
                    </div>
                  </button>
                ))}
                {classes.length > 8 && (
                  <button
                    onClick={() => setShowAllClases(true)}
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      fontSize: '16px',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    ✨ ... más ({classes.length - 8})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Ejercicio */}
      {selectedExercise && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            width: '95%',
            maxWidth: '1200px',
            height: '95vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedExercise(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '32px',
                color: '#ccc',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#999'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#667eea',
              marginBottom: '20px',
              paddingRight: '30px'
            }}>
              {selectedExercise.title}
            </h2>

            <div style={{
              display: 'flex',
              gap: '30px',
              flex: 1,
              overflowY: 'auto'
            }}>
              <div style={{
                flex: '1.5',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <iframe
                  title={`Video de ${selectedExercise.title}`}
                  style={{
                    width: '100%',
                    height: '500px',
                    borderRadius: '12px',
                    border: 'none',
                    marginBottom: '20px'
                  }}
                  src={selectedExercise.videoUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#667eea', marginBottom: '15px' }}>
                  Descripción
                </h3>
                <div style={{
                  background: '#f5f5f5',
                  padding: '25px',
                  borderRadius: '12px',
                  lineHeight: '1.8',
                  color: '#333',
                  fontSize: '16px',
                  flex: 1,
                  overflowY: 'auto'
                }}>
                  <p>
                    {selectedExercise.description}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedExercise(null)}
              style={{
                padding: '14px',
                marginTop: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Clase */}
      {selectedClase && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            width: '95%',
            maxWidth: '600px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedClase(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '32px',
                color: '#ccc',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#999'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#667eea',
              marginBottom: '20px',
              paddingRight: '30px'
            }}>
              {selectedClase.nombre}
            </h2>

            <div style={{
              background: '#f5f5f5',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#667eea', marginBottom: '5px' }}>
                  📅 Fecha y Hora
                </h3>
                <p style={{ fontSize: '16px', color: '#333', margin: 0 }}>
                  {selectedClase.fecha_horario_al_que_va}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#667eea', marginBottom: '5px' }}>
                  ⏱️ Duración
                </h3>
                <p style={{ fontSize: '16px', color: '#333', margin: 0 }}>
                  {selectedClase.duracion}
                </p>
              </div>
            </div>

            <div style={{
              background: '#f5f5f5',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '25px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#667eea', marginBottom: '12px' }}>
                Descripción
              </h3>
              <p style={{
                lineHeight: '1.8',
                color: '#333',
                fontSize: '16px',
                margin: 0
              }}>
                {selectedClase.descripcion}
              </p>
            </div>

            <button
              onClick={() => setSelectedClase(null)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Todas las Clases */}
      {showAllClases && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            width: '95%',
            maxWidth: '800px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setShowAllClases(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '32px',
                color: '#ccc',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#999'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ccc'}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#667eea',
              marginBottom: '30px',
              paddingRight: '30px'
            }}>
              📅 Todas las Clases ({classes.length})
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1,
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {classes.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedClase(c);
                    setShowAllClases(false);
                  }}
                  style={{
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>{c.nombre}</div>
                    <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>{c.duracion}</div>
                  </div>
                  <div style={{ fontSize: '14px', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                    {c.fecha_horario_al_que_va}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAllClases(false)}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EjerciciosYClases;