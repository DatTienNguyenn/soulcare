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

CREATE TABLE psychological_tests (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title varchar(255), -- Ví dụ: DASS-21
    description text,
    config jsonb
);

CREATE TABLE test_results (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id uuid NOT NULL REFERENCES patients(id),
    test_id uuid NOT NULL REFERENCES psychological_tests(id),
    depression_score int,
    anxiety_score int,
    stress_score int,
    created_at timestamp DEFAULT now()
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