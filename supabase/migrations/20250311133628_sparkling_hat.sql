/*
  # Create bookings table and related security policies

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `time_slot_id` (text, required)
      - `customer_name` (text, required)
      - `customer_email` (text, required)
      - `customer_phone` (text, required)
      - `number_of_passengers` (integer, required)
      - `status` (text, required)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `bookings` table
    - Add policies for:
      - Authenticated users can read their own bookings
      - Authenticated users can create bookings
      - Authenticated users can update their own bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time_slot_id text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  number_of_passengers integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt()->>'email');

-- Policy to allow users to create bookings
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy to allow users to update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (customer_email = auth.jwt()->>'email')
  WITH CHECK (customer_email = auth.jwt()->>'email');