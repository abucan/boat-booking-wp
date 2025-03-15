/*
  # Fix trigger function to remove net schema dependency
  
  1. Changes
    - Remove trigger and function that depend on net schema
    - Keep the table structure and policies intact
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_new_booking ON bookings;
DROP FUNCTION IF EXISTS handle_new_booking();

-- Create a simpler trigger function that doesn't depend on net schema
CREATE OR REPLACE FUNCTION handle_new_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Simply return the new row without trying to send emails
  -- Email sending will be handled by the application layer
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new bookings
CREATE TRIGGER on_new_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_booking();