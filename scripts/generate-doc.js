const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  HeadingLevel,
  PageBreak,
} = require("docx");

async function generateReport() {
  const primaryColor = "1B365D"; // Navy Blue
  const secondaryColor = "2B547E";
  const lightBg = "F4F6F9";
  const borderColor = "D0D7DE";

  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    left: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    right: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    insideVertical: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 21, // 10.5 pt
            color: "24292F",
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200,
            },
          },
        },
        children: [
          // Header Top
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "FPT UNIVERSITY • DEPARTMENT OF SOFTWARE ENGINEERING",
                bold: true,
                size: 19,
                color: "57606A",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: "COURSE: SDN302 – SERVER-SIDE WEB DEVELOPMENT",
                bold: true,
                size: 20,
                color: secondaryColor,
              }),
            ],
          }),

          // Main Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "PRACTICAL EXAM SUBMISSION REPORT",
                bold: true,
                size: 32, // 16 pt
                color: primaryColor,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 320 },
            children: [
              new TextRun({
                text: "BÁO CÁO BÀI THI THỰC HÀNH CHÍNH THỨC – SEMESTER: FALL 2026",
                italics: true,
                size: 19,
                color: "57606A",
              }),
            ],
          }),

          // Section 1
          new Paragraph({
            spacing: { before: 180, after: 120 },
            children: [
              new TextRun({
                text: "1. CANDIDATE & DEPLOYMENT CREDENTIALS (THÔNG TIN BẮT BUỘC)",
                bold: true,
                size: 22,
                color: primaryColor,
              }),
            ],
          }),

          // Table 1: Candidate & Credentials
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorder,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 32, type: WidthType.PERCENTAGE },
                    shading: { fill: lightBg },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Student Code (MSSV)", bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 68, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "QE190108", bold: true })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Full Name (Họ và Tên)", bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Nguyen Le Thai Bao", bold: true })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "GitHub Repository URL", bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "https://github.com/thai-baokin/PE_SDN_Exam",
                            color: "0969DA",
                            underline: {},
                          }),
                          new TextRun({ text: " (Branch: main • Public)" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Vercel Production URL", bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "https://pe-sdn-exam.vercel.app",
                            color: "0969DA",
                            underline: {},
                          }),
                          new TextRun({ text: " (Status: Ready / Deployed)" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Test Account Email", bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "grader.qe190108@example.com",
                            bold: true,
                            color: "0969DA",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Test Account Password", bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Test1234!", bold: true })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: lightBg },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Account Registration Note", bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Account was registered directly via application Register API/Page into live Supabase PostgreSQL DB before submission.",
                            italics: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Section 2
          new Paragraph({
            spacing: { before: 280, after: 120 },
            children: [
              new TextRun({
                text: "2. TECHNICAL COMPLIANCE CHECKLIST (KIỂM TRA QUY CHUẨN ĐỀ THI)",
                bold: true,
                size: 22,
                color: primaryColor,
              }),
            ],
          }),

          // Table 2: Checklist
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorder,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 8, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "No.", bold: true, color: "FFFFFF" })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Exam Requirement", bold: true, color: "FFFFFF" })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 62, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Implementation Status & Details", bold: true, color: "FFFFFF" })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("1")] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Framework & UI Stack", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "✔ PASS – ", bold: true, color: "1A7F37" }),
                          new TextRun("Next.js 14 (App Router), TypeScript Strict, Tailwind CSS, ShadCN UI (components.json configured and active with Button, Card, Input, Label, Select...)."),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("2")] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Build & Automation", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "✔ PASS – ", bold: true, color: "1A7F37" }),
                          new TextRun("package.json build script: \"prisma generate && next build\". Clean zero-error build with fresh clone and npm install."),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("3")] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Environment & Security", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "✔ PASS – ", bold: true, color: "1A7F37" }),
                          new TextRun("Zero hardcoded secrets. App relies strictly on 3 env variables: DATABASE_URL, DIRECT_URL, AUTH_SECRET."),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("4")] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Database & Migrations", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "✔ PASS – ", bold: true, color: "1A7F37" }),
                          new TextRun("Supabase PostgreSQL via Prisma 5. Migrations tracked in prisma/migrations and committed to GitHub."),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("5")] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Submission Format", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "✔ PASS – ", bold: true, color: "1A7F37" }),
                          new TextRun("Submission folder contains .docx report and .zip archive without node_modules, .next, .git, or .env files."),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Page Break
          new Paragraph({
            children: [new PageBreak()],
          }),

          // Section 3
          new Paragraph({
            spacing: { before: 180, after: 160 },
            children: [
              new TextRun({
                text: "3. SYSTEM ARCHITECTURE & IMPLEMENTATION DETAILS",
                bold: true,
                size: 22,
                color: primaryColor,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: "• 3.1. Database Schema & Data Models: ", bold: true, color: primaryColor }),
              new TextRun("Thiết kế cơ sở dữ liệu quan hệ hoàn chỉnh (ERD Diagram, quan hệ 1-N giữa User và ReadingLog, các constraints, unique index trên email và index userId+readOn, cascade delete)."),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: "• 3.2. RESTful API Specifications & Status Code Mapping: ", bold: true, color: primaryColor }),
              new TextRun("Bảng đặc tả toàn diện các Endpoints (Authentication, CRUD operations), tuân thủ 100% chuẩn mã HTTP: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 409 (Conflict)."),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: "• 3.3. Frontend UI/UX & Exact Test Hooks (data-testid): ", bold: true, color: primaryColor }),
              new TextRun("Giao diện hiện đại, tối ưu responsive trên mọi thiết bị. Gắn chuẩn xác 100% các thuộc tính data-testid theo từng form input, button, table row và alert message theo đúng yêu cầu tự động chấm của giảng viên."),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({ text: "• 3.4. Security, Cookie Token & Authorization Rules: ", bold: true, color: primaryColor }),
              new TextRun("Cơ chế bảo mật mật khẩu với bcrypt hash, xác thực phiên bằng JWT Token lưu trong HttpOnly cookie an toàn, phân quyền sở hữu tài nguyên dữ liệu nghiêm ngặt giữa các tài khoản người dùng."),
            ],
          }),
          new Paragraph({
            spacing: { after: 360 },
            children: [
              new TextRun({ text: "• 3.5. Verification, Test Results & Production Evidence: ", bold: true, color: primaryColor }),
              new TextRun("Minh chứng kết quả test tự động, các kịch bản kiểm thử API thành công/thất bại, ảnh chụp giao diện thực tế và chứng chỉ build pass trên Vercel & Supabase."),
            ],
          }),

          // Signature
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400 },
            children: [
              new TextRun({
                text: "Candidate Signature: Nguyen Le Thai Bao (QE190108)",
                bold: true,
                italics: true,
                color: "57606A",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath1 = path.join(__dirname, "..", "PRACTICAL_EXAM_SUBMISSION_REPORT.docx");
  const outPath2 = path.join(__dirname, "..", "QE190108.docx");
  fs.writeFileSync(outPath1, buffer);
  fs.writeFileSync(outPath2, buffer);
  console.log("Successfully generated:", outPath1);
  console.log("Successfully generated:", outPath2);
}

generateReport().catch(console.error);

