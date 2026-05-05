/*
  # Create Student Dashboard Tables

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `full_name` (text, student's full name)
      - `age` (integer, student's age)
      - `instrument` (text, primary instrument)
      - `start_date` (date, when student began lessons)
      - `level` (integer, calculated RPG level based on progress)
      - `avatar_url` (text, optional avatar image URL)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users for ownership)

    - `student_skills`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `tuning` (integer 0-100, Afinação)
      - `instrument_practice` (integer 0-100, Prática de Instrumento)
      - `rhythmic_perception` (integer 0-100, Percepção Rítmica)
      - `metric_reading` (integer 0-100, Leitura Métrica)
      - `updated_at` (timestamptz)

    - `student_traits`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `traits` (text array, student characteristics)
      - `critical_difficulties` (text, Dificuldades Críticas)
      - `strengths` (text, Pontos Fortes)
      - `updated_at` (timestamptz)

    - `lesson_history`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `lesson_date` (date, date of the lesson)
      - `grade` (numeric 0-10, grade for the lesson)
      - `notes` (text, optional lesson notes)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own student data
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  age integer NOT NULL,
  instrument text NOT NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  level integer NOT NULL DEFAULT 1,
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own students"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own students"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own students"
  ON students FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS student_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  tuning integer NOT NULL DEFAULT 0 CHECK (tuning >= 0 AND tuning <= 100),
  instrument_practice integer NOT NULL DEFAULT 0 CHECK (instrument_practice >= 0 AND instrument_practice <= 100),
  rhythmic_perception integer NOT NULL DEFAULT 0 CHECK (rhythmic_perception >= 0 AND rhythmic_perception <= 100),
  metric_reading integer NOT NULL DEFAULT 0 CHECK (metric_reading >= 0 AND metric_reading <= 100),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own student skills"
  ON student_skills FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_skills.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can create own student skills"
  ON student_skills FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM students WHERE students.id = student_skills.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can update own student skills"
  ON student_skills FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_skills.student_id AND students.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM students WHERE students.id = student_skills.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can delete own student skills"
  ON student_skills FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_skills.student_id AND students.user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS student_traits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  traits text[] NOT NULL DEFAULT '{}',
  critical_difficulties text NOT NULL DEFAULT '',
  strengths text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_traits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own student traits"
  ON student_traits FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_traits.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can create own student traits"
  ON student_traits FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM students WHERE students.id = student_traits.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can update own student traits"
  ON student_traits FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_traits.student_id AND students.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM students WHERE students.id = student_traits.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can delete own student traits"
  ON student_traits FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_traits.student_id AND students.user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS lesson_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_date date NOT NULL DEFAULT CURRENT_DATE,
  grade numeric NOT NULL DEFAULT 0 CHECK (grade >= 0 AND grade <= 10),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lesson_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson history"
  ON lesson_history FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = lesson_history.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can create own lesson history"
  ON lesson_history FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM students WHERE students.id = lesson_history.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can update own lesson history"
  ON lesson_history FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = lesson_history.student_id AND students.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM students WHERE students.id = lesson_history.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can delete own lesson history"
  ON lesson_history FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = lesson_history.student_id AND students.user_id = auth.uid()));
