/*
  # Add congregation, baptized, and test dates to students

  1. Modified Tables
    - `students`
      - Add `congregation` (text) - Nome da congregação onde o aluno faz aula (ex: São Miguel)
      - Add `baptized` (boolean, default false) - Se o aluno é batizado
      - Add `test_dates` (date array, default empty) - Datas de futuros testes/avaliações

  2. Security
    - No new policies needed; existing RLS policies on students table cover these columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'congregation'
  ) THEN
    ALTER TABLE students ADD COLUMN congregation text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'baptized'
  ) THEN
    ALTER TABLE students ADD COLUMN baptized boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'test_dates'
  ) THEN
    ALTER TABLE students ADD COLUMN test_dates date[] NOT NULL DEFAULT '{}';
  END IF;
END $$;
