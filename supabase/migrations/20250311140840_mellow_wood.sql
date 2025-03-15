/*
  # Create bookings table with proper schema

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `time_slot_id` (text)
      - `booking_date` (timestamptz)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `number_of_passengers` (integer)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `route_id` (text)
      - `tour_type` (text)

  2. Security
    - Enable RLS
    - Add policies for:
      - Anyone can create bookings
      - Users can read their own bookings
      - Users can update their own bookings
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time_slot_id text NOT NULL,
  booking_date timestamptz NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  number_of_passengers integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  route_id text NOT NULL,
  tour_type text NOT NULL
);

-- Drop existing policies if they exist
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

-- Allow users to read their own bookings
CREATE POLICY "Users can read own bookings"
ON bookings FOR SELECT
TO public
USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow users to update their own bookings
CREATE POLICY "Users can update own bookings"
ON bookings FOR UPDATE
TO public
USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email')
WITH CHECK (customer_email = current_setting('request.jwt.claims', true)::json->>'email');