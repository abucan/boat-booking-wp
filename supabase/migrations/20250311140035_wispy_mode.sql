/*
  # Update bookings table schema

  1. Changes
    - Add booking_date column to store the selected date
    - Add route_id column to store the selected route
    - Add tour_type column to store the type of tour
    - Add email notification trigger

  2. Security
    - Update RLS policies to include new columns
*/

-- Add new columns
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_date timestamp with time zone NOT NULL,
ADD COLUMN IF NOT EXISTS route_id text NOT NULL,
ADD COLUMN IF NOT EXISTS tour_type text NOT NULL;

-- Create function to handle email notifications
CREATE OR REPLACE FUNCTION handle_new_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Send email notification using Supabase Edge Function
  PERFORM
    net.http_post(
      url := CONCAT(current_setting('app.settings.edge_function_url'), '/send-booking-email'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', current_setting('app.settings.edge_function_key')
      ),
      body := jsonb_build_object(
        'booking_id', NEW.id,
        'customer_name', NEW.customer_name,
        'customer_email', NEW.customer_email,
        'booking_date', NEW.booking_date,
        'route_id', NEW.route_id,
        'tour_type', NEW.tour_type,
        'number_of_passengers', NEW.number_of_passengers,
        'status', NEW.status
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new bookings
DROP TRIGGER IF EXISTS on_new_booking ON bookings;
CREATE TRIGGER on_new_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_booking();

-- Update RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');