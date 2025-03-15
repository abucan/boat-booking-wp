/*
  # Update bookings table schema

  1. Changes
    - Add booking_date column to store the selected date
    - Add route_id column to store the selected route
    - Add tour_type column to store the type of tour

  2. Security
    - Update RLS policies to include new columns
*/

-- Add new columns
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_date timestamp with time zone NOT NULL,
ADD COLUMN IF NOT EXISTS route_id text NOT NULL,
ADD COLUMN IF NOT EXISTS tour_type text NOT NULL;