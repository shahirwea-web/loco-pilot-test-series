/*
  # Create Psychometric Test Results Tables

  1. New Tables
    - `test_results` - Main test session records
      - `id` (uuid, primary key)
      - `test_id` (text, unique identifier)
      - `overall_accuracy` (numeric)
      - `total_correct` (integer)
      - `total_missed` (integer)
      - `total_false_positives` (integer)
      - `total_groups_viewed` (integer)
      - `overall_avg_response_time` (numeric, milliseconds)
      - `performance_category` (text)
      - `focus_violations` (integer)
      - `created_at` (timestamp)
    
    - `session_results` - Per-session breakdown
      - `id` (uuid, primary key)
      - `test_result_id` (uuid, foreign key)
      - `session_number` (integer)
      - `difficulty` (text)
      - `accuracy` (numeric)
      - `correct_detections` (integer)
      - `missed_targets` (integer)
      - `false_positives` (integer)
      - `total_groups_scanned` (integer)
      - `avg_response_time` (numeric)
      - `duration` (integer, milliseconds)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policy allowing public read for test data (no authentication required for initial release)
*/

CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id text UNIQUE NOT NULL,
  overall_accuracy numeric NOT NULL,
  total_correct integer NOT NULL,
  total_missed integer NOT NULL,
  total_false_positives integer NOT NULL,
  total_groups_viewed integer NOT NULL,
  overall_avg_response_time numeric NOT NULL,
  performance_category text NOT NULL,
  focus_violations integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS session_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_result_id uuid NOT NULL REFERENCES test_results(id) ON DELETE CASCADE,
  session_number integer NOT NULL,
  difficulty text NOT NULL,
  accuracy numeric NOT NULL,
  correct_detections integer NOT NULL,
  missed_targets integer NOT NULL,
  false_positives integer NOT NULL,
  total_groups_scanned integer NOT NULL,
  avg_response_time numeric NOT NULL,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert test results (public submission)
CREATE POLICY "Allow public insert"
  ON test_results
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read test results
CREATE POLICY "Allow public read"
  ON test_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert session results
CREATE POLICY "Allow public insert"
  ON session_results
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read session results
CREATE POLICY "Allow public read"
  ON session_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_results_test_result_id ON session_results(test_result_id);
