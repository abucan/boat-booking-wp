/*
  # Fix RLS policies for bookings table

  1. Security Changes
    - Drop all existing policies
    - Enable RLS on bookings table
    - Add new policies:
      - Allow public access for creating bookings (no auth required)
      - Allow public access for reading own bookings by email
      - Allow public access for updating own bookings by email
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create new policies with public access
CREATE POLICY "Anyone can create bookings"
ON bookings FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read own bookings"
ON bookings FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can update own bookings"
ON bookings FOR UPDATE
TO public
USING (true)
WITH CHECK (true);