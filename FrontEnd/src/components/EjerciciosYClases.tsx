import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExerciseCategory } from '../types';

const EjerciciosYClases: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

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
      title: 'Ejercicios Parte Superior del Cuerpo',
      exercises: [
        {
          id: 1,
          title: 'Press de Banca',
          description: 'Ejercicio fundamental para desarrollar el pecho, hombros y tríceps. Acuéstate en un banco plano, agarra la barra con las manos separadas a la altura de los hombros y bájala controladamente hasta el pecho. Empuja hacia arriba hasta extender completamente los brazos.',
          videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
          category: 'upper'
        },
        {
          id: 2,
          title: 'Dominadas',
          description: 'Excelente para desarrollar la espalda y bíceps. Cuélgate de una barra con las palmas hacia adelante, tira de tu cuerpo hacia arriba hasta que tu barbilla supere la barra. Baja controladamente.',
          videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
          category: 'upper'
        }
      ]
    },
    {
      id: 'lower',
      title: 'Ejercicios Parte Inferior del Cuerpo',
      exercises: [
        {
          id: 3,
          title: 'Sentadillas',
          description: 'El rey de los ejercicios para piernas. Trabaja cuádriceps, glúteos e isquiotibiales. Coloca la barra sobre los hombros, baja flexionando las rodillas hasta que los muslos estén paralelos al suelo y sube.',
          videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
          category: 'lower'
        },
        {
          id: 4,
          title: 'Peso Muerto',
          description: 'Ejercicio compuesto que trabaja toda la cadena posterior. Con la espalda recta, levanta la barra del suelo extendiendo las caderas y rodillas simultáneamente hasta estar completamente erguido.',
          videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
          category: 'lower'
        }
      ]
    },
    {
      id: 'abs',
      title: 'Ejercicios de Abdomen',
      exercises: [
        {
          id: 5,
          title: 'Plancha',
          description: 'Ejercicio isométrico fundamental para el core. Apóyate sobre los antebrazos y puntas de los pies, mantén el cuerpo recto como una tabla. Contrae el abdomen y mantén la posición.',
          videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
          category: 'abs'
        },
        {
          id: 6,
          title: 'Crunches',
          description: 'Clásico ejercicio para abdominales. Acostado boca arriba con rodillas flexionadas, coloca las manos detrás de la cabeza y eleva el torso contrayendo los abdominales. Baja controladamente.',
          videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU',
          category: 'abs'
        }
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
        {/* Left Side - Exercises */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                maxHeight: expandedCategories.has(category.id) ? '800px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}>
                {category.exercises.map((exercise) => (
                  <div key={exercise.id} style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', color: '#333' }}>
                      {exercise.title}
                    </div>
                    <iframe
                      title={`Video de ${exercise.title}`}
                      style={{ width: '100%', maxWidth: '100%', height: '250px', borderRadius: '8px', marginBottom: '10px' }}
                      src={exercise.videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Calendar */}
        <div style={{ flex: '1', background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <h2 style={{ fontSize: '28px', color: '#667eea', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
            📅 Calendario de Clases
          </h2>
          
          <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '20px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}>📆</div>
            <p style={{ color: '#999', textAlign: 'center', fontSize: '16px' }}>
              No hay clases programadas en este momento
            </p>
            <p style={{ color: '#ccc', textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>
              Las clases aparecerán aquí cuando estén disponibles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EjerciciosYClases;