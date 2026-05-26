-- Migration: Add booking fields to appointments table
-- Date: 2026-05-26
-- Description: Adds missing fields needed for specialist booking feature

-- Step 1: Add new columns to appointments table
ALTER TABLE appointments ADD COLUMN booking_type VARCHAR(50);
ALTER TABLE appointments ADD COLUMN start_time VARCHAR(5);  -- Format: HH:MM (e.g., '09:00')
ALTER TABLE appointments ADD COLUMN end_time VARCHAR(5);    -- Format: HH:MM (e.g., '10:00')
ALTER TABLE appointments ADD COLUMN duration INTEGER;        -- Duration in minutes
ALTER TABLE appointments ADD COLUMN total_price DECIMAL(10,2);
ALTER TABLE appointments ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE appointments ADD COLUMN session_notes TEXT;
ALTER TABLE appointments ADD COLUMN completed_at TIMESTAMP;
ALTER TABLE appointments ADD COLUMN created_at TIMESTAMP DEFAULT now();
ALTER TABLE appointments ADD COLUMN cancelled_reason TEXT;

-- Step 2: Add constraint for booking types
ALTER TABLE appointments ADD CONSTRAINT check_booking_type 
  CHECK (booking_type IN ('psychology', 'counseling', 'behavioral', 'meditation', 'general'));

-- Step 3: Improve status constraint to be more explicit
-- First drop existing constraint if any, then add new one
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS check_appointment_status;
ALTER TABLE appointments ADD CONSTRAINT check_appointment_status 
  CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'));

-- Step 4: Create indexes for better query performance
CREATE INDEX idx_appointments_specialist_id_scheduled_at 
  ON appointments(specialist_id, scheduled_at DESC);

CREATE INDEX idx_appointments_patient_id_scheduled_at 
  ON appointments(patient_id, scheduled_at DESC);

CREATE INDEX idx_appointments_status_scheduled_at 
  ON appointments(status, scheduled_at DESC);

CREATE INDEX idx_appointments_created_at 
  ON appointments(created_at DESC);

-- Step 5: Add a trigger to auto-update specialist rating based on reviews
CREATE OR REPLACE FUNCTION update_specialist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE specialists 
  SET rating_avg = (
    SELECT AVG(r.rating)::DECIMAL(3,2)
    FROM reviews r
    JOIN appointments a ON a.id = r.appointment_id
    WHERE a.specialist_id = NEW.id
  )
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: (Optional) Create specialist pricing table for future use
CREATE TABLE IF NOT EXISTS specialist_session_pricing (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    specialist_id uuid NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL,
    price_per_session DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(specialist_id, session_type)
);

-- Step 7: (Optional) Create specialist availability table for booking system
CREATE TABLE IF NOT EXISTS specialist_availability (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    specialist_id uuid NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time VARCHAR(5) NOT NULL,  -- HH:MM format
    end_time VARCHAR(5) NOT NULL,    -- HH:MM format
    break_time_start VARCHAR(5),     -- Optional break
    break_time_end VARCHAR(5),       -- Optional break
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Step 8: (Optional) Create specialist analytics cache table
CREATE TABLE IF NOT EXISTS specialist_booking_stats (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    specialist_id uuid NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
    stats_date DATE NOT NULL,
    total_bookings INTEGER DEFAULT 0,
    completed_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    no_show_count INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    unique_patients INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(specialist_id, stats_date)
);

-- Step 9: Populate created_at if appointments already exist and don't have it
-- (Only needed if you have existing appointments)
-- UPDATE appointments SET created_at = scheduled_at WHERE created_at IS NULL;

-- Step 10: Add comments documenting the fields
COMMENT ON COLUMN appointments.booking_type IS 'Type of session: psychology, counseling, behavioral, meditation, general';
COMMENT ON COLUMN appointments.start_time IS 'Start time in HH:MM format (e.g., 09:00)';
COMMENT ON COLUMN appointments.end_time IS 'End time in HH:MM format (e.g., 10:00)';
COMMENT ON COLUMN appointments.duration IS 'Session duration in minutes';
COMMENT ON COLUMN appointments.total_price IS 'Amount charged for the session';
COMMENT ON COLUMN appointments.currency IS 'Currency code (USD, EUR, VND, etc.)';
COMMENT ON COLUMN appointments.session_notes IS 'Clinical notes from the specialist about the session';
COMMENT ON COLUMN appointments.completed_at IS 'Timestamp when session was actually completed';
COMMENT ON COLUMN appointments.created_at IS 'When the booking was created';
COMMENT ON COLUMN appointments.cancelled_reason IS 'Reason for cancellation if status is CANCELLED';

-- Verify the changes
-- SELECT * FROM appointments LIMIT 1;
-- \d appointments  -- To see table structure in psql
