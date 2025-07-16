-- Create enum types for section and correct_answer
CREATE TYPE section_type AS ENUM ('verbal', 'math');
CREATE TYPE answer_type AS ENUM ('A', 'B', 'C', 'D');

-- Create the sat_questions table
CREATE TABLE IF NOT EXISTS sat_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section section_type NOT NULL,
  subtopic TEXT NOT NULL,
  question JSONB NOT NULL,
  correct_answer answer_type NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 0 AND difficulty_level <= 5),
  choices JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_sat_questions_section ON sat_questions(section);
CREATE INDEX IF NOT EXISTS idx_sat_questions_difficulty ON sat_questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_sat_questions_subtopic ON sat_questions(subtopic);

-- Set up Row Level Security (RLS)
ALTER TABLE sat_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow all users to read questions
CREATE POLICY "Anyone can read questions"
  ON sat_questions
  FOR SELECT
  USING (true);

-- Only allow admins to insert, update, or delete questions
-- Note: You'll need to implement admin role checking in your application
CREATE POLICY "Only admins can insert questions"
  ON sat_questions
  FOR INSERT
  WITH CHECK (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

CREATE POLICY "Only admins can update questions"
  ON sat_questions
  FOR UPDATE
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

CREATE POLICY "Only admins can delete questions"
  ON sat_questions
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
CREATE TRIGGER update_sat_questions_updated_at
BEFORE UPDATE ON sat_questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 