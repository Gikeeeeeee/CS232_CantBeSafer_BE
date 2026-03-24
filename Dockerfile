FROM node:18-alpine

WORKDIR /app

# 1. ลง Library ทั้งหมด (รวม nodemon และ typescript)
COPY package*.json ./
RUN npm install

# 2. ก๊อปโค้ดทั้งหมดเข้า Container
COPY . .

# 3. Build รอไว้เลย (เพื่อให้มีโฟลเดอร์ dist/ สำหรับตอนจะรันจริง)
RUN npm run build

EXPOSE 3000

# ค่าเริ่มต้นให้รันแบบ Production (ตัวที่ build แล้ว)
CMD ["node", "dist/index.js"]