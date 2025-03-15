/*
  # Fix RLS policies for bookings table

  1. Security Changes
    - Drop existing policies
    - Enable RLS on bookings table
    - Add policies for:
      - Anyone can create bookings (authenticated or not)
      - Anyone can read their own bookings by email
      - Anyone can update their own bookings by email
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create bookings
CREATE POLICY "Anyone can create bookings"
ON bookings FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read their own bookings
CREATE POLICY "Anyone can read own bookings"
ON bookings FOR SELECT
TO public
USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow anyone to update their own bookings
CREATE POLICY "Anyone can update own bookings"
ON bookings FOR UPDATE
TO public
USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email')
WITH CHECK (customer_email = current_setting('request.jwt.claims', true)::json->>'email');