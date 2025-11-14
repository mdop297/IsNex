# CSR (Client-Side Rendering)

(fetch/axios/react-query gọi ở browser)
→ Hợp data thay đổi nhiều, không cần SEO.

## Use cases

1. UI tương tác nhiều, thay đổi liên tục (high-interactivity UIs)

- Những trang mà user thao tác liên tục và logic chủ yếu nằm ở client: - Editor (text editor, PDF highlighter, block editor) - Kanban board - Drag-drop dashboard - Chat UI
  → Những thứ này cần state, event, real-time updates → CSR là “pivotal fit”.

2. Data thay đổi real-time / cần polling / WebSocket

- Notifications panel
- Chat messages
- Real-time logs (LLMOps console, training monitor)
- Live search suggestions
  → Render ở client để cập nhật nhanh, không reload.

3. State phức tạp phía client

- Những nơi state không chỉ là “fetch rồi show”: - Complex filters - Local sorting, grouping - View mode switching - Multi-step UI flows
  → CSR giúp stateful logic mượt hơn nhiều.

4. Trang không cần SEO

- Nếu Google không cần đọc nội dung thì CSR nhanh gọn nhất: - User dashboard - Settings - Internal admin panel - Authenticated pages nói chung
  → Vì SEO = irrelevant.

5. Apps có user-specific data (private dashboard)

- Vì dữ liệu khác nhau cho từng user → SEO không cần → CSR là pragmatic:
  - User’s personal notes
  - Saved documents
  - Workspace, history
  - Personal recommendations

6. Khi muốn fetch với React Query / TanStack Query

- React Query là client-first → nên kết hợp CSR là best fit: - Infinite scroll - Caching client-side - Offline mode - Background refetch
  → RSC không làm được kiểu này.

7. Form-driven UI

- Những chỗ user thao tác form liên tục:
  - CRUD instant feedback
  - Wizard forms
  - Form validation client-side nặng

# Implementation
