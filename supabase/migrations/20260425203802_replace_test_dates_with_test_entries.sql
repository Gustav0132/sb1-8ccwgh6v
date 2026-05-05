/*
  # Replace test_dates with test_entries table

  1. Changes
    - Remove `test_dates` column from `students` table (was a date array, not descriptive enough)
    - Create `student_test_entries` table with:
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `description` (text) - Full description of the test (e.g. "Realizou teste para reunião de jovens")
      - `test_date` (date) - Date of the test
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `student_test_entries`
    - Add policies for authenticated users to manage their own students' test entries
*/

ALTER TABLE students DROP COLUMN IF EXISTS test_dates;

CREATE TABLE IF NOT EXISTS student_test_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  test_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_test_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own student test entries"
  ON student_test_entries FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_test_entries.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can create own student test entries"
  ON student_test_entries FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM students WHERE students.id = student_test_entries.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can update own student test entries"
  ON student_test_entries FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_test_entries.student_id AND students.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM students WHERE students.id = student_test_entries.student_id AND students.user_id = auth.uid()));

CREATE POLICY "Users can delete own student test entries"
  ON student_test_entries FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM students WHERE students.id = student_test_entries.student_id AND students.user_id = auth.uid()));
