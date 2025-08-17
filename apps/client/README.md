This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Folder structure

```
.
├── public                      # Static assets (ảnh, font, file tĩnh)
│   └── temp                    # Thư mục tạm cho file pdf PdfViewer
└── src                         # Code chính của app
    ├── app                     # Next.js App Router (routes + pages)
    │   ├── api                 # API routes (serverless functions)
    │   │   └── fake-data       # Mock/fake API để test
    │   ├── auth                # Nhóm route authentication
    │   │   ├── forgotpassword  # Trang quên mật khẩu
    │   │   ├── resetpassword   # Trang reset mật khẩu
    │   │   ├── signin          # Trang đăng nhập
    │   │   └── signup          # Trang đăng ký
    │   ├── (home)              # Layout + routes chính sau khi login
    │   │   ├── chats           # Chat feature
    │   │   │   └── [chat_id]   # Chat detail (dynamic route)
    │   │   ├── home            # Trang dashboard/home
    │   │   ├── library         # Quản lý tài liệu & notes
    │   │   │   ├── annos       # Annotation (sẽ bỏ đi, hiện tại dùng để test ui)
    │   │   │   ├── docs        # Documents
    │   │   │   └── notes       # Notes (sẽ migrate sang Blocknote, và refactor tree note folder )
    │   │   ├── scanner         # Scanner (có thể OCR / file scan, bây giờ chưa có gì, ui nhẹ)
    │   │   ├── setting         # User setting trong home (chưa có gì)
    │   │   ├── summarizer      # Tóm tắt tài liệu (chưa có gì, ui nhẹ)
    │   │   └── workspace       # Trang workspace
    │   │       └── [w_id]      # Dynamic workspace id
    │   │           └── overview # Overview của workspace
    │   ├── user                # Routes liên quan đến user profile
    │   │   └── setting         # User settings
    │   └── (workspace)         # Layout riêng cho workspace
    │       └── workspace
    │           └── [w_id]      # Dynamic workspace id
    │               ├── @chat   # Parallel route cho chat panel
    │               ├── @note   # Parallel route cho note panel
    │               └── @pdf    # Parallel route cho pdf panel
    ├── components              # Reusable React components
    │   ├── auth                # UI cho auth (login/signup)
    │   ├── chat                # UI cho chat box
    │   ├── documents           # UI cho document viewer
    │   ├── file-upload         # UI + logic upload file
    │   ├── landing             # Components cho landing page
    │   ├── magicui             # UI effects/animation đặc biệt
    │   ├── notes               # UI cho notes
    │   ├── pdf                 # PDF viewer & highlighter
    │   │   ├── pdfhighlighter  # Custom pdf highlighter
    │   │   │   ├── components  # Component con cho highlighter
    │   │   │   ├── contexts    # Context provider
    │   │   │   ├── lib         # Helper/lib cho highlighter
    │   │   │   └── style       # CSS/style
    │   │   └── PDFViewer       # Viewer chính cho PDF
    │   │       ├── contexts    # Context PDF viewer
    │   │       ├── Sidebar     # Sidebar của PDF viewer
    │   │       ├── style       # CSS/style
    │   │       ├── Toolbar     # Toolbar PDF viewer
    │   │       └── utils       # Utility functions
    │   ├── providers           # Global providers (theme, auth, etc.)
    │   ├── ui                  # UI shared components (button, input,…) shadcn ui
    │   └── workspace           # Components cho workspace
    ├── data                    # Data mẫu / static data
    ├── hooks                   # Custom React hooks
    ├── lib                     # Helper functions, util library
    ├── schemas                 # Validation schemas (Zod/Yup, etc.)
    └── types                   # TypeScript types/interfaces

```

- Hiện tại data trong ứng dụng là fake và còn nằm nhiều chỗ, sau khi có backend sẽ refactor lại.
- phần types trong project sẽ chỉnh lại cho nằm trong folder types.
- Đừng đọc code kỹ quá, hiểu nó cho output gì là ok.
