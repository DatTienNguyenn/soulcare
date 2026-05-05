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
    duration varchar(50), -- e.g., "3-5 minutes"
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
    answers jsonb, -- JSON object: {"questionId": score, ...}
    created_at timestamp DEFAULT now(),
    CONSTRAINT valid_test_score CHECK (score >= 0 AND max_score > 0)
);

-- Create indexes for faster queries
CREATE INDEX idx_test_results_patient_id ON test_results(patient_id);
CREATE INDEX idx_test_results_test_id ON test_results(test_id);
CREATE INDEX idx_test_results_created_at ON test_results(created_at);

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
    status varchar(20) DEFAULT 'PENDING' -- PENDING, CONFIRMED, COMPLETED, CANCELLED
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