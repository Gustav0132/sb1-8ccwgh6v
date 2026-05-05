/*
  # Add baptism_date column to students

  1. Modified Tables
    - `students`
      - Add `baptism_date` (date, nullable) - Data de batismo do aluno. Null se não batizado.

  2. Security
    - No new policies needed; existing RLS policies cover this column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'baptism_date'
  ) THEN
    ALTER TABLE students ADD COLUMN baptism_date date;
  END IF;
END $$;
