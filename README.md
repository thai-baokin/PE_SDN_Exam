# ReadLog - SDN302 Practical Exam (Fall 2026)

## Cấu trúc dự án
Dự án được xây dựng theo chuẩn yêu cầu của bài thi PE SDN302 (ReadLog - Personal Reading Log):
- **Framework**: Next.js (App Router, TypeScript)
- **Styling & UI**: Tailwind CSS + ShadCN UI (Button, Card, Input, Label...)
- **ORM**: Prisma với PostgreSQL (Supabase)
- **Auth**: Tự xây dựng custom JWT Authentication với HttpOnly Cookie `session_token`
- **State Management**: React Context (`AuthContext` & `ReadingLogContext`)

---

## 3 Biến môi trường cần thiết
Tạo file `.env.local` ở thư mục gốc (không commit file này):
```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
AUTH_SECRET="your-random-32-character-secret-key-here"
```

---

## Các bước hoàn thiện để nộp bài

### Bước 1: Tạo Database trên Supabase
1. Vào [supabase.com](https://supabase.com) tạo một project mới.
2. Vào **Project Settings** -> **Database** -> **Connection string**:
   - Chọn tab **URI** -> **Transaction mode** (port 6543) gán cho `DATABASE_URL`.
   - Chọn tab **URI** -> **Session mode** (port 5432) gán cho `DIRECT_URL`.
3. Điền 2 URL trên cùng `AUTH_SECRET` vào file `.env.local`.

### Bước 2: Chạy Database Migration
```bash
npx prisma db push
```

### Bước 3: Đẩy code lên GitHub
```bash
git push -u origin main
```

### Bước 4: Deploy lên Vercel
1. Vào [vercel.com](https://vercel.com) -> **Add New Project** -> Chọn repository `PE_SDN_Exam`.
2. Trong phần **Environment Variables**, thêm đủ 3 biến:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
3. Nhấn **Deploy**.
4. **Lưu ý quan trọng**: Đảm bảo tắt **Vercel Authentication** (Vercel Project Settings -> Deployment Protection -> Vercel Authentication -> Disabled) để hệ thống chấm bài tự động có thể truy cập.

### Bước 5: Tạo Test Account cho Grader
- Email: `grader.qe190108@example.com`
- Password: `Test1234!`
- Đã được đăng ký và khởi tạo trực tiếp qua API vào Supabase PostgreSQL DB.
