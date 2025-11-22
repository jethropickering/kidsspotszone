-- =====================================================
-- KIDS SPORTS ZONE - EMAIL SERVICE SETUP
-- =====================================================
-- This script sets up email logging and tracking tables
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create email_logs table to track all sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('contact', 'newsletter', 'venue_claim', 'venue_approved', 'venue_rejected', 'welcome', 'password_reset')),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced', 'delivered', 'opened', 'clicked')),
  provider_id TEXT, -- Email provider's message ID (e.g., Resend ID)
  error_message TEXT,
  metadata JSONB, -- Additional data about the email
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for querying by recipient
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);

-- Create index for querying by type
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);

-- Create index for querying by status
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- Create index for querying by date
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_logs_updated_at
  BEFORE UPDATE ON email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_email_logs_updated_at();

-- =====================================================
-- Newsletter Subscribers Table (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Create partial index for active subscribers (only if status column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'status'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_newsletter_active
    ON newsletter_subscribers(status)
    WHERE status = 'active';
  END IF;
END $$;

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Admin can view all email logs
CREATE POLICY "Admins can view email logs"
  ON email_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Service role can insert email logs (for Edge Function)
CREATE POLICY "Service role can insert email logs"
  ON email_logs FOR INSERT
  WITH CHECK (true); -- Edge Function uses service role key

-- Enable RLS on newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON newsletter_subscribers FOR SELECT
  USING (email = auth.email());

-- Users can update their own subscription (unsubscribe)
CREATE POLICY "Users can update own subscription"
  ON newsletter_subscribers FOR UPDATE
  USING (email = auth.email());

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON newsletter_subscribers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE email_logs IS 'Tracks all emails sent through the system';
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscription list';

COMMENT ON COLUMN email_logs.type IS 'Type of email sent (contact, newsletter, venue_claim, etc.)';
COMMENT ON COLUMN email_logs.recipient IS 'Email address of recipient';
COMMENT ON COLUMN email_logs.subject IS 'Email subject line';
COMMENT ON COLUMN email_logs.status IS 'Delivery status (sent, failed, bounced, delivered, opened, clicked)';
COMMENT ON COLUMN email_logs.provider_id IS 'Email provider message ID for tracking';
COMMENT ON COLUMN email_logs.metadata IS 'Additional data about the email (JSON)';

COMMENT ON COLUMN newsletter_subscribers.status IS 'Subscription status (active, unsubscribed, bounced)';

-- =====================================================
-- HELPFUL QUERIES
-- =====================================================

-- View recent emails sent
-- SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 50;

-- View emails by type
-- SELECT type, COUNT(*) FROM email_logs GROUP BY type;

-- View email delivery stats
-- SELECT status, COUNT(*) FROM email_logs GROUP BY status;

-- View active newsletter subscribers
-- SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active';

-- View failed emails
-- SELECT * FROM email_logs WHERE status = 'failed' ORDER BY created_at DESC;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Deploy Supabase Edge Function: supabase functions deploy send-email
-- 2. Set environment variables in Supabase Dashboard:
--    - RESEND_API_KEY (get from resend.com)
-- 3. Test contact form and newsletter subscription
-- =====================================================
