-- ============================================================
-- Portfolio Supabase Setup Script
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- ────────────────────────────────────────────
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ────────────────────────────────────────────

ALTER TABLE IF EXISTS profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS education    ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS experience   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users        ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────
-- 2. PUBLIC READ POLICIES (no auth required)
--    DROP first so re-running this script is safe.
-- ────────────────────────────────────────────

DROP POLICY IF EXISTS "Public can read profiles"     ON profiles;
DROP POLICY IF EXISTS "Public can read projects"     ON projects;
DROP POLICY IF EXISTS "Public can read certificates" ON certificates;
DROP POLICY IF EXISTS "Public can read skills"       ON skills;
DROP POLICY IF EXISTS "Public can read education"    ON education;
DROP POLICY IF EXISTS "Public can read experience"   ON experience;

CREATE POLICY "Public can read profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Public can read certificates"
  ON certificates FOR SELECT USING (true);

CREATE POLICY "Public can read skills"
  ON skills FOR SELECT USING (true);

CREATE POLICY "Public can read education"
  ON education FOR SELECT USING (true);

CREATE POLICY "Public can read experience"
  ON experience FOR SELECT USING (true);

-- NOTE: The service role key used by the Vercel serverless functions
-- bypasses RLS automatically — no extra write policy needed.

-- ────────────────────────────────────────────
-- 3. ANALYTICS TABLE (optional page-view tracking)
-- ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analytics (
  id          uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  page        text,
  visitor_id  text,
  event       text         DEFAULT 'page_view',
  created_at  timestamptz  DEFAULT now()
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only on analytics" ON analytics;
CREATE POLICY "Service role only on analytics"
  ON analytics FOR ALL USING (false);

-- ────────────────────────────────────────────
-- 4. ADD MISSING COLUMNS (safe — only adds if absent)
-- ────────────────────────────────────────────

-- profiles
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS availability  text;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS social_links  jsonb        DEFAULT '{}'::jsonb;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS resume_url    text;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS avatar        text;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS updated_at    timestamptz  DEFAULT now();

-- projects
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS tech_stack    text[]       DEFAULT '{}';
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS live_url      text;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS github_url    text;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS image_url     text;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS featured      boolean      DEFAULT false;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS updated_at    timestamptz  DEFAULT now();

-- certificates
ALTER TABLE IF EXISTS certificates ADD COLUMN IF NOT EXISTS issue_date     date;
ALTER TABLE IF EXISTS certificates ADD COLUMN IF NOT EXISTS credential_url text;
ALTER TABLE IF EXISTS certificates ADD COLUMN IF NOT EXISTS image_url      text;
ALTER TABLE IF EXISTS certificates ADD COLUMN IF NOT EXISTS category       text         DEFAULT 'Other';
ALTER TABLE IF EXISTS certificates ADD COLUMN IF NOT EXISTS updated_at     timestamptz  DEFAULT now();

-- ────────────────────────────────────────────
-- 5. ADMIN USER
--    The serverless auth endpoint handles bcrypt upgrades automatically.
--    This sets the password to plain-text "admin123" — on first login the
--    server upgrades it to a bcrypt hash in-place.
--    If you already have a bcrypt hash stored, skip this block.
-- ────────────────────────────────────────────

INSERT INTO users (email, password)
VALUES ('freshtalent491@gmail.com', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- ────────────────────────────────────────────
-- Done! Go to Vercel → Project Settings → Environment Variables
-- and add: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET
-- ────────────────────────────────────────────
