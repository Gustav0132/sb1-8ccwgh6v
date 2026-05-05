import type { StudentDashboard } from './types';

export const mockDashboard: StudentDashboard = {
  student: {
    id: '1',
    fullName: 'Luna Valentina Silva',
    age: 14,
    instrument: 'Violino',
    startDate: '2024-03-15',
    level: 7,
    avatarUrl: '',
    congregation: 'São Miguel',
    baptized: true,
    baptismDate: '2026-02-01',
  },
  skills: {
    studentId: '1',
    tuning: 78,
    instrumentPractice: 85,
    rhythmicPerception: 62,
    metricReading: 71,
  },
  traits: {
    studentId: '1',
    traits: [
      'Perfeccionista',
      'Criativa',
      'Dedicada',
      'Sensível ao som',
      'Trabalha bem sob pressão',
    ],
    criticalDifficulties:
      'Dificuldade com compassos compostos (5/4 e 7/8). Tende a acelerar o andamento em passagens técnicas complexas. Leitura à primeira vista ainda inconsistente.',
    strengths:
      'Excelente ouvido para afinação. Expressividade natural nas frases musicais. Disciplina na prática diária. Boa postura corporal ao instrumento.',
  },
  lessonHistory: [
    { id: '1', studentId: '1', lessonDate: '2025-10-05', grade: 6.5, notes: '' },
    { id: '2', studentId: '1', lessonDate: '2025-10-12', grade: 7.0, notes: '' },
    { id: '3', studentId: '1', lessonDate: '2025-10-19', grade: 6.8, notes: '' },
    { id: '4', studentId: '1', lessonDate: '2025-10-26', grade: 7.5, notes: '' },
    { id: '5', studentId: '1', lessonDate: '2025-11-02', grade: 7.2, notes: '' },
    { id: '6', studentId: '1', lessonDate: '2025-11-09', grade: 8.0, notes: '' },
    { id: '7', studentId: '1', lessonDate: '2025-11-16', grade: 7.8, notes: '' },
    { id: '8', studentId: '1', lessonDate: '2025-11-23', grade: 8.5, notes: '' },
    { id: '9', studentId: '1', lessonDate: '2025-11-30', grade: 8.2, notes: '' },
    { id: '10', studentId: '1', lessonDate: '2025-12-07', grade: 9.0, notes: '' },
  ],
  testEntries: [
    { id: '1', studentId: '1', description: 'Realizou teste para reunião de jovens', testDate: '2026-05-20' },
    { id: '2', studentId: '1', description: 'Teste para culto de domingo', testDate: '2026-07-15' },
    { id: '3', studentId: '1', description: 'Avaliação para grupo de louvor', testDate: '2026-09-10' },
  ],
};
