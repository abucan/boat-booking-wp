/*
  # Update bookings table with booking date

  1. Changes
    - Add `booking_date` column to store the selected date for the booking
    
  2. Security
    - No changes to existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'booking_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN booking_date timestamptz NOT NULL;
  END IF;
END $$;