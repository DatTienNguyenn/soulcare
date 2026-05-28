-- Kích hoạt tiện ích mở rộng để tạo UUID tự động
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --- PHÂN HỆ NGƯỜI DÙNG & PHÂN QUYỀN ---

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email varchar(255) UNIQUE NOT NULL,
    password_hash text NOT NULL,
    role varchar(20) CHECK (role IN ('PATIENT', 'SPECIALIST', 'ADMIN')),
    created_at timestamp DEFAULT now()
);

CREATE TABLE patients (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name varchar(255),
    date_of_birth date,
    gender varchar(50)
);

CREATE TABLE specialists (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name varchar(255),
    specialty_tags text[], -- Lưu mảng: {'trầm cảm', 'lo âu'}
    rating_avg decimal(3,2) DEFAULT 0
);

-- --- PHÂN HỆ SỨC KHỎE & AI ---

CREATE TABLE diaries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id uuid NOT NULL REFERENCES patients(id),
    title VARCHAR(255),
    mood VARCHAR(20) CHECK (mood IN ('neutral', 'happy', 'sad', 'excited', 'calm', 'stress')),
    date Date,
    content text, -- Nội dung thô (Bảo mật: Chuyên gia không xem trực tiếp)
    status varchar(20) CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    hashtag text, -- Phân loại từ người dùng hoặc AI
    created_at timestamp DEFAULT now(),
    last_update timestamp DEFAULT now()
);

CREATE TABLE pictures (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id uuid NOT NULL REFERENCES patients(id),
    drawing_data jsonb, -- Dữ liệu vector cho AI (GPT-4o) phân tích
    image_url text,    -- Link ảnh (S3/Cloudinary)
    metadata jsonb,    -- Thông tin vẽ: thời gian, màu sắc, số lần xóa
    description text,
    status varchar(20) DEFAULT 'PUBLISHED',
    created_at timestamp DEFAULT now(),
    last_update timestamp DEFAULT now()
);

CREATE TABLE ai_sentiment (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    diary_id uuid REFERENCES diaries(id),
    picture_id uuid REFERENCES pictures(id),
    mood_score int,
    sentiment_label varchar(50),
    summary_for_expert text, -- AI tổng hợp cho chuyên gia xem
    CHECK (diary_id IS NOT NULL OR picture_id IS NOT NULL) -- Ít nhất phải có 1 trong 2
);

-- Mental Health Tests (Test Definitions)
CREATE TABLE mental_health_tests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_name varchar(255) NOT NULL,
    short_name varchar(50),
    description text,
    duration integer, -- Duration in minutes
    total_questions integer,
    min_score integer,
    max_score integer,
    scoring_guide jsonb, -- JSON object with scoring categories and ranges
    status varchar(20) CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')) DEFAULT 'ACTIVE',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    created_by varchar(255), -- Admin email who created the test
    CONSTRAINT valid_scores CHECK (min_score <= max_score)
);

-- Create index for faster queries
CREATE INDEX idx_mental_health_tests_status ON mental_health_tests(status);

-- Test Results (User Test Submissions)
CREATE TABLE test_results (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    test_id uuid NOT NULL REFERENCES mental_health_tests(id) ON DELETE RESTRICT,
    test_name varchar(255), -- Denormalized for display
    score integer,
    max_score integer,
    level varchar(50), -- e.g., 'Normal', 'Mild', 'Moderate', 'Severe', 'Very Severe'
    description text, -- Result interpretation/feedback
    answers text, -- JSON string: {"questionId": score, ...}
    created_at timestamp DEFAULT now(),
    CONSTRAINT valid_test_score CHECK (score >= 0 AND max_score > 0)
);

-- Create indexes for faster queries
CREATE INDEX idx_test_results_patient_id ON test_results(patient_id);
CREATE INDEX idx_test_results_test_id ON test_results(test_id);
CREATE INDEX idx_test_results_created_at ON test_results(created_at);

-- Test Questions Table
CREATE TABLE test_questions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id uuid NOT NULL REFERENCES mental_health_tests(id) ON DELETE CASCADE,
    question_text text NOT NULL,
    question_type varchar(50) CHECK (question_type IN ('MULTIPLE_CHOICE', 'RATING_SCALE', 'TEXT')) DEFAULT 'MULTIPLE_CHOICE',
    question_order integer NOT NULL,
    score_weight integer DEFAULT 1,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Question Options/Answers Table
CREATE TABLE question_options (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id uuid NOT NULL REFERENCES test_questions(id) ON DELETE CASCADE,
    option_text text NOT NULL,
    option_value integer NOT NULL,
    option_order integer NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_test_questions_test_id ON test_questions(test_id);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);

-- Keep backward compatibility with old psychological_tests structure
CREATE TABLE psychological_tests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(255),
    description text,
    config jsonb,
    DEPRECATED BOOLEAN DEFAULT true
);

-- --- PHÂN HỆ TƯ VẤN & EHR (BỆNH ÁN ĐIỆN TỬ) ---

CREATE TABLE appointments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id uuid NOT NULL REFERENCES patients(id),
    specialist_id uuid NOT NULL REFERENCES specialists(id),
    scheduled_at timestamp NOT NULL,
    booking_type VARCHAR(50) In CHECK (booking_type IN ('ONLINE', 'IN_PERSON')) DEFAULT 'ONLINE',
    start_time VARCHAR(5),
    end_time VARCHAR(5),
    duration INTEGER,
    total_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    session_notes text,
    completed_at timestamp,
    created_at timestamp DEFAULT now(),
    cancelled_reason text,
    status varchar(20) IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'PENDING'
);

CREATE TABLE video_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    room_id text, -- WebRTC Room ID
    duration_seconds int,
    started_at timestamp
);

CREATE TABLE reviews (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    rating int CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp DEFAULT now()
);

CREATE TABLE electronic_health_records (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id uuid NOT NULL REFERENCES patients(id),
    specialist_id uuid NOT NULL REFERENCES specialists(id),
    appointment_id uuid NOT NULL REFERENCES appointments(id),
    diagnosis text NOT NULL,
    treatment_plan text,
    created_at timestamp DEFAULT now()
);

CREATE TABLE clinical_summaries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id uuid NOT NULL REFERENCES patients(id),
    summary_text text,
    trend_data jsonb,
    updated_at timestamp DEFAULT now()
);

-- Create specialist pricing table for future use
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

-- Create specialist availability table for booking system
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

-- Create specialist analytics cache table
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

-- --- HÀM & TRIGGER TỰ ĐỘNG CẬP NHẬT LAST_UPDATE ---

CREATE OR REPLACE FUNCTION update_last_update_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_update = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_diaries_modtime BEFORE UPDATE ON diaries FOR EACH ROW EXECUTE PROCEDURE update_last_update_column();
CREATE TRIGGER update_pictures_modtime BEFORE UPDATE ON pictures FOR EACH ROW EXECUTE PROCEDURE update_last_update_column();

-- --- AUTO-UPDATE FOR MENTAL HEALTH TESTS ---

CREATE OR REPLACE FUNCTION update_mental_health_tests_modtime()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mental_health_tests_modtime BEFORE UPDATE ON mental_health_tests FOR EACH ROW EXECUTE PROCEDURE update_mental_health_tests_modtime();

-- Auto update specialist rating based on reviews
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