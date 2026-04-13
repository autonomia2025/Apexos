-- ============================================
-- RLS Policies for Apex OS
-- Run in Supabase SQL Editor
-- ============================================

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow users to delete their own logs
CREATE POLICY "Users delete own nutrition logs"
  ON nutrition_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users delete own fitness logs"
  ON fitness_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users delete own finance logs"
  ON finance_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users delete own learning logs"
  ON learning_logs FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Allow users to update their own logs
CREATE POLICY "Users update own nutrition logs"
  ON nutrition_logs FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users update own fitness logs"
  ON fitness_logs FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users update own finance logs"
  ON finance_logs FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users update own learning logs"
  ON learning_logs FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
