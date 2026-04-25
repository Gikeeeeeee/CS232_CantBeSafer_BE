CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
                -- ID รันอัตโนมัติ (1, 2, 3...)
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
    address TEXT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,

    -- เชื่อมไปยังตาราง users
    reported_by INTEGER NOT NULL,
    CONSTRAINT fk_user_report 
        FOREIGN KEY(reported_by) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE,

    report_status VARCHAR(50) DEFAULT 'reported', -- สถานะเริ่มต้นเป็น 'reported'

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    assigned_at TIMESTAMP NULL,
    complete_at TIMESTAMP NULL
);

CREATE TABLE report_evidences (
    evidence_id SERIAL PRIMARY KEY,
    
    -- เชื่อมกับตาราง reports (ตัวแม่)
    report_id INTEGER NOT NULL,
    CONSTRAINT fk_report_evidence
        FOREIGN KEY(report_id)
        REFERENCES reports(report_id)
        ON DELETE CASCADE, -- ถ้าลบ Report หลัก ข้อมูลหลักฐานจะถูกลบตาม

    file_url TEXT NOT NULL, -- ปรับเป็น TEXT เผื่อ URL จาก S3 ยาวมาก
    file_type VARCHAR(50),
    
    -- เชื่อมกับตาราง users (คนอัปโหลดไฟล์)
    uploaded_by INTEGER NOT NULL,
    CONSTRAINT fk_user_evidence
        FOREIGN KEY(uploaded_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL, -- ถ้าลบ User ให้เก็บหลักฐานไว้ แต่เซตคนอัปโหลดเป็น NULL

    latitude FLOAT NULL,
    longitude FLOAT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- 4. ตารางประวัติการเปลี่ยนสถานะ (เพื่อดูว่าใครเป็นคนเปลี่ยน และเปลี่ยนจากอะไรเป็นอะไร)
CREATE TABLE report_status_logs (
    log_id SERIAL PRIMARY KEY,
    
    -- เชื่อมกับตาราง reports
    report_id INTEGER NOT NULL,
    CONSTRAINT fk_status_report
        FOREIGN KEY(report_id)
        REFERENCES reports(report_id)
        ON DELETE CASCADE,

    old_status VARCHAR(50), -- สถานะก่อนหน้า
    new_status VARCHAR(50), -- สถานะใหม่
    
    -- เชื่อมกับตาราง users (มักจะเป็น Admin หรือ Staff ที่เป็นคนแก้)
    updated_by INTEGER NOT NULL,
    CONSTRAINT fk_status_user
        FOREIGN KEY(updated_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL, -- ถ้าลบ Admin ให้เก็บ Log ไว้แต่เซตคนทำเป็น NULL

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ตารางขอบเขตการแจ้งเหตุ (ใช้เก็บพิกัดวงกลม หรือรัศมีรอบจุดเกิดเหตุ)
CREATE TABLE report_boundaries (
    boundary_id SERIAL PRIMARY KEY,
    
    -- เชื่อมกับตาราง reports (แบบ 1 ต่อ 1 หรือ 1 ต่อ Many ขึ้นอยู่กับการใช้งาน)
    report_id INTEGER NOT NULL UNIQUE, -- ใส่ UNIQUE ถ้า 1 Report มีแค่ 1 รัศมี
    CONSTRAINT fk_boundary_report
        FOREIGN KEY(report_id)
        REFERENCES reports(report_id)
        ON DELETE CASCADE,

    radius FLOAT NOT NULL DEFAULT 50.0, -- รัศมี (เช่น เมตร) ตามรูป API Design ที่คุณส่งมา
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ตารางแจ้งเตือน (Notifications) ยึดตามการออกแบบในรูปภาพ
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    
    -- เชื่อมกับตาราง users (ผู้รับการแจ้งเตือน)
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_notification_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE,

    -- เชื่อมกับตาราง reports (เหตุการณ์ที่เกี่ยวข้อง)
    report_id INTEGER,
    CONSTRAINT fk_notification_report
        FOREIGN KEY(report_id) 
        REFERENCES reports(report_id) 
        ON DELETE SET NULL,

    message TEXT NOT NULL,                -- ข้อความแจ้งเตือน
    sent_at TIMESTAMP DEFAULT NOW(),      -- วันที่เวลาที่ส่ง
    is_read BOOLEAN DEFAULT FALSE         -- สถานะการอ่าน (เริ่มเป็น false)
);

-- 7. สร้างผู้ดูแลระบบ (Admin) เริ่มต้น
-- เปิดใช้งาน extension pgcrypto เพื่อให้สามารถ Hash รหัสผ่านด้วย bcrypt ได้โดยตรงใน SQL
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (username, password_hash, email, role) 
VALUES (
    'gikegm', 
    crypt('gikegm', gen_salt('bf', 12)), -- เข้ารหัสผ่าน 'gikegm' ด้วย bcrypt (Cost=12 ให้ตรงกับ Backend)
    'gikegm@example.com', 
    'admin'
);