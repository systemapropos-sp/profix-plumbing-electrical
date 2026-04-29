-- ProFix Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'plumber', 'electrician', 'customer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  avatar_url TEXT,
  license_number TEXT,
  gps_tracking_enabled BOOLEAN DEFAULT FALSE,
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  last_location_update TIMESTAMPTZ,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Settings
CREATE TABLE company_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  logo_url TEXT,
  name TEXT NOT NULL DEFAULT 'ProFix',
  address TEXT,
  phone TEXT,
  email TEXT,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'America/New_York',
  branding_colors JSONB,
  whatsapp_business_number TEXT,
  auto_send_quote_whatsapp BOOLEAN DEFAULT FALSE,
  auto_send_reminder_whatsapp BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  type TEXT CHECK (type IN ('residential', 'commercial')),
  notes TEXT,
  source TEXT DEFAULT 'walk-in',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes
CREATE TABLE quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id),
  employee_id UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'pending_approval', 'approved', 'rejected', 'expired')),
  service_type TEXT CHECK (service_type IN ('plumbing', 'electrical', 'both')),
  description TEXT,
  line_items JSONB DEFAULT '[]',
  subtotal DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  valid_until TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  rejection_reason TEXT,
  converted_to_job_id UUID,
  before_photos TEXT[] DEFAULT '{}',
  notes TEXT,
  sent_via TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote Approvals
CREATE TABLE quote_approvals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  token UUID DEFAULT uuid_generate_v4() UNIQUE,
  customer_email TEXT,
  customer_whatsapp TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  ip_address TEXT,
  signature_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  customer_id UUID REFERENCES customers(id),
  employee_id UUID REFERENCES profiles(id),
  quote_id UUID REFERENCES quotes(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  service_type TEXT CHECK (service_type IN ('plumbing', 'electrical', 'both')),
  address TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  scheduled_date DATE,
  scheduled_time TIME,
  estimated_duration INTEGER,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  materials_used JSONB DEFAULT '[]',
  total_cost DECIMAL(10, 2) DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partial')),
  invoice_number TEXT,
  notes TEXT,
  before_photos TEXT[] DEFAULT '{}',
  after_photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  employee_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'no_show', 'cancelled')),
  reminder_sent BOOLEAN DEFAULT FALSE,
  confirmation_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Parts
CREATE TABLE inventory_parts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT CHECK (category IN ('plumbing_parts', 'electrical_parts', 'tools', 'general')),
  quantity_stock INTEGER DEFAULT 0,
  quantity_minimum INTEGER DEFAULT 5,
  price_cost DECIMAL(10, 2) DEFAULT 0,
  price_sale DECIMAL(10, 2) DEFAULT 0,
  supplier_id UUID,
  location_warehouse TEXT,
  barcode TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE suppliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  products_supplied TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases
CREATE TABLE purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  supplier_id UUID REFERENCES suppliers(id),
  date DATE NOT NULL,
  items JSONB DEFAULT '[]',
  total_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'ordered' CHECK (status IN ('ordered', 'received', 'cancelled')),
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  amount DECIMAL(10, 2) NOT NULL,
  method TEXT CHECK (method IN ('cash', 'card', 'check', 'online')),
  date TIMESTAMPTZ DEFAULT NOW(),
  reference_number TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline Stages
CREATE TABLE pipeline_stages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  order INTEGER NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  default_for_service_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Pipeline
CREATE TABLE job_pipeline (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES pipeline_stages(id),
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  notes TEXT
);

-- Expenses
CREATE TABLE expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  receipt_url TEXT,
  employee_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Tracking
CREATE TABLE time_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES profiles(id),
  job_id UUID REFERENCES jobs(id),
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  break_duration INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  invoice_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Logs
CREATE TABLE whatsapp_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  to_number TEXT NOT NULL,
  message_preview TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Templates
CREATE TABLE whatsapp_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  template_body TEXT NOT NULL,
  type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own, admins can read all
CREATE POLICY "Profiles access" ON profiles FOR ALL USING (
  auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
  )
);

-- Customers: all authenticated users can read, admin/supervisor can write
CREATE POLICY "Customers read" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Customers write" ON customers FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
);

-- Quotes: all authenticated can read, admin/supervisor/employee can write
CREATE POLICY "Quotes read" ON quotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Quotes write" ON quotes FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  OR employee_id = auth.uid()
);

-- Jobs: all authenticated can read, admin/supervisor/assigned can write
CREATE POLICY "Jobs read" ON jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Jobs write" ON jobs FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  OR employee_id = auth.uid()
);

-- Appointments: all authenticated can read, admin/supervisor can write
CREATE POLICY "Appointments read" ON appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Appointments write" ON appointments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
);

-- Inventory: all authenticated can read, admin/supervisor can write
CREATE POLICY "Inventory read" ON inventory_parts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Inventory write" ON inventory_parts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status, gps_tracking_enabled)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    'active',
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
