-- Create the exam_results table
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  result JSONB NOT NULL DEFAULT '{}',
  result_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_exam_results_user_id ON exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_exam_id ON exam_results(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_created_at ON exam_results(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view only their own results
CREATE POLICY "Users can view their own results"
  ON exam_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own results
CREATE POLICY "Users can insert their own results"
  ON exam_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own results
CREATE POLICY "Users can update their own results"
  ON exam_results
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own results
CREATE POLICY "Users can delete their own results"
  ON exam_results
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow admins to view all results
CREATE POLICY "Admins can view all results"
  ON exam_results
  FOR SELECT
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

-- Allow admins to insert results for any user
CREATE POLICY "Admins can insert results for any user"
  ON exam_results
  FOR INSERT
  WITH CHECK (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

-- Allow admins to update any result
CREATE POLICY "Admins can update any result"
  ON exam_results
  FOR UPDATE
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

-- Allow admins to delete any result
CREATE POLICY "Admins can delete any result"
  ON exam_results
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
CREATE TRIGGER update_exam_results_updated_at
BEFORE UPDATE ON exam_results
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 