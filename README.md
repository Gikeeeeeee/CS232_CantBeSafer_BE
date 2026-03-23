# Cloud Backend Project

คู่มือการตั้งค่าโปรเจกต์

---

## ✅ สิ่งที่ต้องมีก่อน (Prerequisites)

| สิ่งที่ต้องการ | ตรวจสอบด้วยคำสั่ง |
|---|---|
| [Node.js](https://nodejs.org/) (v18+) | `node -v` |
| [npm](https://www.npmjs.com/) | `npm -v` |
| [Git](https://git-scm.com/) | `git -v` |

---

## ⚙️ ขั้นตอนการติดตั้ง

### 1. Clone โปรเจกต์
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่าไฟล์ Environment
```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env
```
จากนั้นเปิดไฟล์ `.env` แล้วแก้ไขค่าให้ตรงกับเครื่องของคุณ เช่น:
```env
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### 4. รันโปรเจกต์
```bash
# Development mode (auto-restart เมื่อแก้ไขไฟล์)
npm run dev (ใช้อันนี้เป็นหลัก)

# Production mode
npm start
```

เปิดเบราว์เซอร์ไปที่ → `http://localhost:3000`

---

## 📁 โครงสร้างโปรเจกต์

```
src/
├── index.js              # จุดเริ่มต้นของแอป — เปิดเซิร์ฟเวอร์
├── routes/               # กำหนด URL path ว่าไปหา Controller ไหน
│   └── userRoutes.js
├── controllers/          # รับ Request → ส่ง Response + HTTP Status
│   └── userController.js
├── services/             # Logic หลัก (Business Logic)
│   └── userService.js
├── models/               # โครงสร้างฐานข้อมูล + Query
│   └── userModel.js
├── middlewares/          # ตัวกลางดักจับ Request (เช่น ตรวจ Auth)
│   └── authMiddleware.js
└── utils/                # ฟังก์ชันช่วยเหลือทั่วไป (เช่น จัดรูปแบบวันที่)
```

### 🔄 การไหลของ Request

```
Client Request
    ↓
routes/        →  กำหนดเส้นทาง URL
    ↓
middlewares/   →  ตรวจสอบสิทธิ์ / Auth
    ↓
controllers/   →  จัดการ req & res
    ↓
services/      →  ประมวลผล Business Logic
    ↓
models/        →  ดึง/บันทึกข้อมูลในฐานข้อมูล
    ↓
Client Response
```

---

## 🛠️ Scripts ที่ใช้บ่อย

| คำสั่ง | ความหมาย |
|---|---|
| `npm start` | รันโปรเจกต์แบบปกติ |
| `npm run dev` | รันแบบ Dev (nodemon) |
| `npm test` | รัน Unit Tests |

---

## ❓ ปัญหาที่พบบ่อย

**`Cannot find module` error**
→ ลอง `npm install` อีกครั้ง

**Port ถูกใช้งานอยู่แล้ว**
→ เปลี่ยน `PORT` ในไฟล์ `.env` เป็นเลขอื่น เช่น `3001`

**ต่อฐานข้อมูลไม่ได้**
→ ตรวจสอบ `DATABASE_URL` ในไฟล์ `.env` ว่าถูกต้อง


## การใช้ Docker - Workflow

→ 1. docker-compose up -d --build (ใช้เวลา - มีการแก้ไข Code or Dependency) / docker-compose up -d (ปกติ)

→ 2. docker-compose logs -f backend (Check Error)   

→ 3. docker-compose down (ปิดระบบ)                                                   
