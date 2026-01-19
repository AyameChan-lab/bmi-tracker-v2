# คู่มือการนำระบบ BMI Health Tracker ขึ้นใช้งานบน Vercel

เอกสารนี้จะอธิบายขั้นตอนการนำโปรเจกต์ BMI Health Tracker ขึ้นสู่ระบบ Cloud ของ Vercel อย่างละเอียด ตั้งแต่การจัดการ Source Code ไปจนถึงการตั้งค่าฐานข้อมูล

## 1. วิธี Push โปรเจกต์ขึ้น GitHub

1.  ไปที่ [GitHub.com](https://github.com) แล้วสร้าง Repository ใหม่ (ตั้งชื่อเช่น `bmi-tracker`)
2.  เปิด Terminal ในโปรเจกต์ของคุณ แล้วพิมพ์คำสั่งต่อไปนี้:

    ```bash
    # เริ่มต้น Git repo (ถ้ายังไม่ได้ทำ)
    git init

    # เพิ่มไฟล์ทั้งหมด
    git add .

    # บันทึกการเปลี่ยนแปลง
    git commit -m "Initial commit for BMI Tracker"

    # เปลี่ยน branch เป็น main (ถ้าจำเป็น)
    git branch -M main

    # เชื่อมต่อกับ GitHub (แทนที่ URL ด้วยของของคุณ)
    git remote add origin https://github.com/YOUR_USERNAME/bmi-tracker.git

    # อัปโหลดโค้ด
    git push -u origin main
    ```

## 2. การเตรียมฐานข้อมูล (สำคัญ)

โปรเจกต์นี้เริ่มต้นด้วย **SQLite** สำหรับการพัฒนา (Development) แต่เมื่อนำขึ้น Vercel แนะนำให้ใช้ **PostgreSQL** (เช่น Vercel Postgres, Neon, หรือ Supabase) เนื่องจาก SQLite บน Vercel จะข้อมูลหายทุกครั้งที่ Deploy ใหม่

**สิ่งที่ต้องแก้ไขก่อน Deploy:**

1.  เปิดไฟล์ `prisma/schema.prisma`
2.  เปลี่ยน `provider` จาก `"sqlite"` เป็น `"postgresql"`

    ```prisma
    datasource db {
      provider = "postgresql" // เปลี่ยนเป็น postgresql
      url      = env("DATABASE_URL")
    }
    ```

3.  ลบโฟลเดอร์ `migrations` เดิม (ถ้ามี) และไฟล์ `dev.db` ออกจาก git (ปกติ gitignore ไว้อยู่แล้ว)
4.  Push โค้ดที่แก้ไขนี้ขึ้น GitHub อีกครั้ง (`git add .`, `git commit -m "Switch to Postgres"`, `git push`)

## 3. วิธี Import โปรเจกต์เข้า Vercel

1.  ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2.  คลิกปุ่ม **"Add New..."** -> **"Project"**
3.  เลือก **"Import"** ที่ Repository `bmi-tracker` ของคุณจาก GitHub
4.  ในหน้า Configure Project:
    - **Framework Preset:** Next.js (ควรเลือกให้อัตโนมัติ)
    - **Root Directory:** `./` (ค่าเริ่มต้น)

## 4. วิธีตั้งค่า Environment Variables

ในหัวข้อ **Environment Variables** บนหน้า Configure Project ให้เพิ่มค่าต่างๆ ดังนี้:

| ชื่อตัวแปร (Key)  | คำอธิบาย / ตัวอย่างค่า (Value)                                                                                                                                                              |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`    | **Connection String ของฐานข้อมูล PostgreSQL** <br> (เช่น `postgres://user:pass@host:5432/dbname`) <br> _หากใช้ Vercel Postgres สามารถกดสร้าง Database ในหน้านี้แล้วมันจะเติมให้อัตโนมัติ_   |
| `NEXTAUTH_SECRET` | **รหัสลับสำหรับเข้ารหัส Session** <br> สามารถเจนได้ด้วยคำสั่ง `openssl rand -base64 32` หรือใช้ข้อความยาวๆ ที่เดายาก                                                                        |
| `NEXTAUTH_URL`    | **URL ของเว็บหลัง Deploy** <br> (เช่น `https://bmi-tracker.vercel.app`) <br> _หมายเหตุ: บน Vercel เบื้องต้นอาจไม่ต้องใส่ เพราะ NextAuth V4+ จัดการให้อัตโนมัติ แต่ใส่ไว้เพื่อความชัวร์ก็ดี_ |

## 5. วิธีเชื่อมต่อฐานข้อมูลและ Deploy

1.  เมื่อตั้งค่า Environment Variables ครบแล้ว ให้กดปุ่ม **"Deploy"**
2.  รอให้ Vercel ทำการ Build และ Deploy เสร็จสิ้น
3.  หาก Build ผ่าน แต่เข้าเว็บแล้ว Error เรื่อง Database ให้ไปที่แท็บ **Settings** ของโปรเจกต์ใน Vercel
4.  ไปที่เมนู **Build & Development Settings**
5.  ดูที่ **Build Command** เราตั้งค่าไว้เป็น `next build` ซึ่งโปรเจกต์นี้ได้เพิ่ม `postinstall` script ให้รัน `prisma generate` ไว้แล้ว
6.  **การสร้างตารางใน Database (Migration):**
    - เนื่องจาก Vercel เป็น Serverless เราอาจไม่สะดวก SSH เข้าไปรันคำสั่ง
    - วิธีที่ง่ายที่สุดคือกดเชื่อมต่อ Git กับเครื่องเรา แล้วรันคำสั่งนี้ในเครื่องเรา (โดยแก้ `.env` ในเครื่องให้ `DATABASE_URL` ชี้ไปที่ของ Production ชั่วคราว หรือใช้ Command Line):

    ```bash
    # รันคำสั่งนี้เพื่อดัน Schema เข้า Database จริง
    npx prisma db push
    ```

    _(ต้องมั่นใจว่าเครื่องเราเชื่อมต่อเน็ตและเข้าถึง Database ปลายทางได้)_

## 6. วิธี Redeploy และทดสอบระบบ

### การ Redeploy

- ทุกครั้งที่คุณแก้ไขโค้ดและ Push ขึ้น GitHub (`git push`), Vercel จะทำการ **Redeploy เที่ใหม่ให้อัตโนมัติ**

### การทดสอบระบบหลัง Deploy

1.  เปิด URL ที่ Vercel ให้มา (เช่น `https://bmi-tracker-xyz.vercel.app`)
2.  ลองกดปุ่ม **Register** เพื่อสมัครสมาชิกใหม่ (ทดสอบการเขียน Database)
3.  Login เข้าสู่ระบบ
4.  ลองกรอกข้อมูล BMI (Weight, Height, Date) และกดบันทึก
5.  ตรวจสอบว่ากราฟ BMI History แสดงผลถูกต้อง
6.  ลอง Login ด้วย User อื่นเพื่อตรวจสอบว่าข้อมูลแยกกัน ไม่เห็นข้อมูลของ User แรก

---

**ขอให้สนุกกับการใช้งาน BMI Health Tracker!**
