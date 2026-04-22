-- Unified Features Migration: 12 new tables
-- Ported from authichain-unified (Vite+Express+tRPC, MySQL) → Supabase PostgreSQL

-- 1. Scheduled Job Runs
CREATE TABLE IF NOT EXISTS scheduled_job_runs (
  id serial PRIMARY KEY,
  job_name varchar(128) NOT NULL,
  status text NOT NULL CHECK (status IN ('running','completed','failed')),
  started_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  duration int,
  result jsonb,
  error text,
  items_processed int DEFAULT 0
);

-- 2. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  type text NOT NULL CHECK (type IN ('authentication','certificate','payment','subscription','nft','referral','system','alert','supply_chain','autopilot')),
  title varchar(256) NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false NOT NULL,
  action_url varchar(512),
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- 3. Autopilot Config
CREATE TABLE IF NOT EXISTS autopilot_config (
  id serial PRIMARY KEY,
  enabled boolean DEFAULT false,
  mode text DEFAULT 'balanced' CHECK (mode IN ('conservative','balanced','aggressive')),
  guardrails jsonb,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Autopilot Decisions
CREATE TABLE IF NOT EXISTS autopilot_decisions (
  id serial PRIMARY KEY,
  type varchar(64) NOT NULL,
  action varchar(256) NOT NULL,
  reasoning text,
  confidence int,
  status text DEFAULT 'pending' CHECK (status IN ('pending','executed','overridden','failed')),
  result jsonb,
  overridden_by uuid REFERENCES auth.users(id),
  override_reason text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  affiliate_code varchar(32) NOT NULL UNIQUE,
  commission_rate numeric(5,2) DEFAULT 10.00,
  total_earnings numeric(18,2) DEFAULT 0,
  pending_payout numeric(18,2) DEFAULT 0,
  total_referrals int DEFAULT 0,
  total_conversions int DEFAULT 0,
  tier text DEFAULT 'basic' CHECK (tier IN ('basic','silver','gold','platinum')),
  active_referrals int DEFAULT 0,
  paypal_email varchar(320),
  status text DEFAULT 'pending' CHECK (status IN ('active','suspended','pending')),
  payout_method varchar(64),
  payout_details jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Affiliate Commissions
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id serial PRIMARY KEY,
  affiliate_id int NOT NULL REFERENCES affiliates(id),
  payment_id text,
  amount numeric(18,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','paid','rejected')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 7. White Label Clients
CREATE TABLE IF NOT EXISTS white_label_clients (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  company_name varchar(256) NOT NULL,
  domain varchar(256),
  logo_url text,
  primary_color varchar(16),
  secondary_color varchar(16),
  api_key varchar(128) NOT NULL UNIQUE,
  api_secret varchar(256),
  status text DEFAULT 'pending' CHECK (status IN ('active','suspended','pending')),
  monthly_api_calls int DEFAULT 0,
  api_call_limit int DEFAULT 10000,
  features jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Missions
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  description text NOT NULL,
  type varchar(64),
  status text NOT NULL CHECK (status IN ('pending','active','completed','failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);

-- 9. Mission Tasks
CREATE TABLE IF NOT EXISTS mission_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','in_progress','completed','failed')),
  task_order int NOT NULL,
  payload jsonb,
  result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mission_tasks_mission ON mission_tasks(mission_id, task_order);

-- 10. Bonuses
CREATE TABLE IF NOT EXISTS bonuses (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  bonus_type varchar(64) NOT NULL,
  bonus_name varchar(256) NOT NULL,
  bonus_value int NOT NULL,
  tier text CHECK (tier IN ('starter','professional','enterprise','agency')),
  status text DEFAULT 'pending' CHECK (status IN ('pending','claimed','delivered')),
  delivery_method varchar(64),
  claimed_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 11. Fraud Alerts
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  product_id uuid,
  alert_type varchar(128) NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  description text,
  status text DEFAULT 'open' CHECK (status IN ('open','investigating','resolved','dismissed')),
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 12. Customer Health Scores
CREATE TABLE IF NOT EXISTS customer_health_scores (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  score int NOT NULL,
  factors jsonb,
  trend text DEFAULT 'stable' CHECK (trend IN ('improving','stable','declining')),
  last_calculated_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
