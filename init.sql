CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,            -- ID รันอัตโนมัติ (1, 2, 3...)
    username VARCHAR(255) UNIQUE NOT NULL, -- ชื่อผู้ใช้ (ห้ามซ้ำ)
    password_hash VARCHAR(255) NOT NULL,   -- รหัสผ่านที่เข้ารหัสแล้ว
    email VARCHAR(255) UNIQUE NOT NULL,    -- อีเมล (ห้ามซ้ำ)
    role VARCHAR(50) DEFAULT 'user',       -- บทบาท เช่น user, admin
    created_at TIMESTAMP DEFAULT NOW(),    -- วันที่สมัครสมาชิก
    is_active BOOLEAN DEFAULT TRUE,        -- สถานะการใช้งาน (เปิด/ปิด)
    last_login TIMESTAMP NULL              -- วันที่เข้าสู่ระบบล่าสุด (ว่างไว้ก่อนได้)
);

CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    report_title VARCHAR(255) NOT NULL,
    report_description TEXT,
    urgency_score INTEGER,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    image_url TEXT,
    
    -- ตั้งค่า Foreign Key เชื่อมไปยังตาราง users
    reported_by INTEGER NOT NULL,
    CONSTRAINT fk_user 
        FOREIGN KEY(reported_by) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE, -- ถ้าลบ User รายงานของ User คนนั้นจะถูกลบไปด้วย (หรือเปลี่ยนเป็น SET NULL ก็ได้)

    report_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    assigned_at TIMESTAMP NULL,
    complete_at TIMESTAMP NULL
);