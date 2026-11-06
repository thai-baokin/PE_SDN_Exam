# ExpenseTrail - SDN302 Practical Exam

## Cấu trúc dự án
Dự án được xây dựng theo chuẩn yêu cầu của bài thi PE SDN302:
- **Framework**: Next.js (App Router, TypeScript)
- **Styling & UI**: Tailwind CSS + ShadCN UI (Button, Card, Input, Label, Select...)
- **ORM**: Prisma với PostgreSQL (Supabase)
- **Auth**: Tự xây dựng custom JWT Authentication với HttpOnly Cookie `session_token`
- **State Management**: React Context (`AuthContext` & `ExpenseContext`)

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
Chạy lệnh sau trên terminal để tạo bảng trên Supabase:
```bash
npx prisma migrate deploy
```
*(Thư mục `prisma/migrations` đã được tạo sẵn trong project).*

### Bước 3: Đẩy code lên GitHub
```bash
git push -u origin main
```
*(Nếu cần token hoặc authentication, đăng nhập GitHub tương ứng).*

### Bước 4: Deploy lên Vercel
1. Vào [vercel.com](https://vercel.com) -> **Add New Project** -> Chọn repository `PE_SDN_Exam`.
2. Trong phần **Environment Variables**, thêm đủ 3 biến:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
3. Nhấn **Deploy**.
4. **Lưu ý quan trọng**: Đảm bảo tắt **Vercel Authentication** (Vercel Project Settings -> Deployment Protection -> Vercel Authentication -> Disabled) để hệ thống chấm bài tự động có thể truy cập.

### Bước 5: Tạo Test Account cho Grader
1. Truy cập vào trang web đã deploy trên Vercel: `https://<your-project>.vercel.app/register`.
2. Đăng ký tài khoản test theo định dạng mã sinh viên của bạn:
   - Email: `grader.<mã_sv>@example.com` (ví dụ: `grader.qe123456@example.com`)
   - Password: `Test1234!`
3. Đăng nhập thử một lần trên web để kiểm tra.

### Bước 6: Chuẩn bị file nộp bài
1. **File Word** (`<Mã_SV>.docx`):
   ```text
   Student Code: <Mã_SV>
   Full Name: <Họ và Tên>
   GitHub Repository URL: https://github.com/thai-baokin/PE_SDN_Exam
   Vercel Production URL: https://<your-project>.vercel.app
   Test account email: grader.<mã_sv>@example.com
   Test account password: Test1234!
   ```
2. **File Zip** (`<Mã_SV>.zip`):
   Nén toàn bộ source code ngoại trừ `node_modules`, `.next`, `.git`, `.env.local`.

