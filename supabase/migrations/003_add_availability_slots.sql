-- Add hourly time preference to inquiries and admin-managed blocked slots
ALTER TABLE inquiries
ADD COLUMN IF NOT EXISTS preferred_time TIME;

CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_hour SMALLINT NOT NULL CHECK (slot_hour >= 0 AND slot_hour <= 23),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slot_date, slot_hour)
);

ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blocked_slots'
      AND policyname = 'Public can view blocked slots'
  ) THEN
    CREATE POLICY "Public can view blocked slots"
      ON blocked_slots FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blocked_slots'
      AND policyname = 'Authenticated users have full access to blocked slots'
  ) THEN
    CREATE POLICY "Authenticated users have full access to blocked slots"
      ON blocked_slots FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
