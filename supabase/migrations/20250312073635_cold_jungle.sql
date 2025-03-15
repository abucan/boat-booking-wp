/*
  # Fix RLS policies for bookings table

  1. Security Changes
    - Drop existing policies if they exist
    - Enable RLS on bookings table
    - Add policies for:
      - Anyone can create bookings (authenticated or not)
      - Anyone can read their own bookings by email
      - Anyone can update their own bookings by email
*/

DO $$ 
BEGIN
    -- Drop policies if they exist
    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Anyone can create bookings'
    ) THEN
        DROP POLICY "Anyone can create bookings" ON bookings;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Anyone can read own bookings'
    ) THEN
        DROP POLICY "Anyone can read own bookings" ON bookings;
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Anyone can update own bookings'
    ) THEN
        DROP POLICY "Anyone can update own bookings" ON bookings;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Anyone can create bookings'
    ) THEN
        CREATE POLICY "Anyone can create bookings"
        ON bookings FOR INSERT
        TO public
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Anyone can read own bookings'
    ) THEN
        CREATE POLICY "Anyone can read own bookings"
        ON bookings FOR SELECT
        TO public
        USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'bookings' 
        AND policyname = 'Anyone can update own bookings'
    ) THEN
        CREATE POLICY "Anyone can update own bookings"
        ON bookings FOR UPDATE
        TO public
        USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email')
        WITH CHECK (customer_email = current_setting('request.jwt.claims', true)::json->>'email');
    END IF;
END $$;