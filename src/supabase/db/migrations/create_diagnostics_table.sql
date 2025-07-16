-- Create the diagnostics table
CREATE TABLE IF NOT EXISTS diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_profile_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  math_diagnostic_id UUID REFERENCES exam_results(id) ON DELETE SET NULL,
  verbal_diagnostic_id UUID REFERENCES exam_results(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_diagnostics_user_id ON diagnostics(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_user_profile_id ON diagnostics(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_math_diagnostic_id ON diagnostics(math_diagnostic_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_verbal_diagnostic_id ON diagnostics(verbal_diagnostic_id);

-- Set up Row Level Security (RLS)
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view only their own diagnostic records
CREATE POLICY "Users can view their own diagnostic records"
  ON diagnostics
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own diagnostic records
CREATE POLICY "Users can insert their own diagnostic records"
  ON diagnostics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own diagnostic records
CREATE POLICY "Users can update their own diagnostic records"
  ON diagnostics
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own diagnostic records
CREATE POLICY "Users can delete their own diagnostic records"
  ON diagnostics
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow admins to view all diagnostic records
CREATE POLICY "Admins can view all diagnostic records"
  ON diagnostics
  FOR SELECT
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

-- Allow admins to insert diagnostic records for any user
CREATE POLICY "Admins can insert diagnostic records for any user"
  ON diagnostics
  FOR INSERT
  WITH CHECK (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

-- Allow admins to update any diagnostic record
CREATE POLICY "Admins can update any diagnostic record"
  ON diagnostics
  FOR UPDATE
  USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' = 'admin');

-- Allow admins to delete any diagnostic record
CREATE POLICY "Admins can delete any diagnostic record"
  ON diagnostics
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
CREATE TRIGGER update_diagnostics_updated_at
BEFORE UPDATE ON diagnostics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 