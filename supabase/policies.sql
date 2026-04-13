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

-- Calendar Events
CREATE POLICY "Users can read shared and own events"
  ON calendar_events FOR SELECT TO authenticated
  USING (visibility = 'shared' OR created_by = auth.uid());

CREATE POLICY "Users can insert own events"
  ON calendar_events FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own events"
  ON calendar_events FOR UPDATE TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own events"
  ON calendar_events FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- Goal Progress History
CREATE POLICY "Read goal history"
  ON goal_progress_history FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Insert goal history"
  ON goal_progress_history FOR INSERT TO authenticated
  WITH CHECK (true);


