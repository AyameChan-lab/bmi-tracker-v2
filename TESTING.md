# Testing Plan for BMI Tracker

## 1. Overview
เอกสารนี้อธิบายแผนการทดสอบ (Test Plan) สำหรับโปรเจกต์ BMI Tracker โดยเน้นการใช้ **Playwright** ในการทำ End-to-End (E2E) Testing เพื่อตรวจสอบความถูกต้องของ User Interface และ Business Logic หลัก

## 2. Tools & Environment
- **Framework**: Playwright
- **Language**: TypeScript
- **Test Runner**: Playwright Test Runner
- **Environment**: Localhost (http://localhost:3000)

## 3. Test Scope
การทดสอบจะครอบคลุมฟังก์ชันหลักดังนี้:
1. **Authentication (Login/Register)**
   - ตรวจสอบองค์ประกอบหน้าเว็บ (UI Elements)
   - ตรวจสอบการนำทาง (Navigation)
   - **[New]** ตรวจสอบการ Login เข้าสู่ระบบจริง
2. **BMI Feature**
   - **[New]** ตรวจสอบการกรอกข้อมูลน้ำหนักและส่วนสูง
   - **[New]** ตรวจสอบการคำนวณและการบันทึกข้อมูล

## 4. Test Scenarios

### 4.1 Authentication (Existing)
| ID | Test Case | Description | Status |
|----|-----------|-------------|--------|
| AUTH-001 | Homepage Redirect | เข้าหน้าแรกต้อง Redirect ไป Login ถ้ายังไม่เข้าสู่ระบบ | ✅ Done |
| AUTH-002 | Login UI | หน้า Login มี Input และปุ่มครบถ้วน | ✅ Done |
| AUTH-003 | Login to Register | ลิงก์ไปหน้าสมัครสมาชิกทำงานถูกต้อง | ✅ Done |
| AUTH-004 | Register UI | หน้า Register มี Input และปุ่มครบถ้วน | ✅ Done |
| AUTH-005 | Register to Login | ลิงก์กลับมาหน้า Login ทำงานถูกต้อง | ✅ Done |

### 4.2 Functional Testing (To Be Implemented)
| ID | Test Case | Description | Status |
|----|-----------|-------------|--------|
| FUNC-001 | **User Login** | ทดสอบการกรอก Email/Password และกด Login สำเร็จ | ⏳ Pending |
| FUNC-002 | **BMI Input** | ทดสอบการกรอกน้ำหนัก/ส่วนสูง และบันทึกข้อมูลสำเร็จ | ⏳ Pending |

## 5. How to Run Tests

### Run all tests (Headless)
```bash
npx playwright test
```

### Run with UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run specific file
```bash
npx playwright test tests/functional.spec.ts
```
