-- Create enum type for exam type
CREATE TYPE exam_type AS ENUM ('verbal', 'math', 'verbal_diagnostic', 'math_diagnostic');

-- Create the exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type exam_type NOT NULL,
  questions UUID[] NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_exams_type ON exams(type);

-- Set up Row Level Security (RLS)
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow all users to read exams
CREATE POLICY "Anyone can read exams"
  ON exams
  FOR SELECT
  USING (true);

-- Only allow admins to insert, update, or delete exams
CREATE POLICY "Only admins can insert exams"
  ON exams
  FOR INSERT
  WITH CHECK (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

CREATE POLICY "Only admins can update exams"
  ON exams
  FOR UPDATE
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

CREATE POLICY "Only admins can delete exams"
  ON exams
  FOR DELETE
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_exams_updated_at
BEFORE UPDATE ON exams
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 