-- ================================================================
-- BHAGAVATI MEDICAL STORE AND PHARMA
-- Supabase Schema for Appointments & Prescription Orders
-- Target Project ID: rqdkmxhbymgtlntxtmop
-- ================================================================

-- 1. Create the appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    consultation_type TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'confirmed',
    source TEXT DEFAULT 'Bhagavati Medical Web Booking',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create the prescription_orders table (for prescription uploads)
CREATE TABLE IF NOT EXISTS public.prescription_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    address TEXT,
    prescription_file_name TEXT,
    delivery_type TEXT DEFAULT 'quick-dharwad',
    notes TEXT,
    status TEXT DEFAULT 'received',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_orders ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies allowing web visitors to insert bookings & orders
CREATE POLICY "Allow public insert to appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public read of appointments"
ON public.appointments
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public insert to prescription_orders"
ON public.prescription_orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public read of prescription_orders"
ON public.prescription_orders
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON public.appointments(phone_number);
CREATE INDEX IF NOT EXISTS idx_appointments_created ON public.appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.prescription_orders(phone_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.prescription_orders(created_at DESC);
