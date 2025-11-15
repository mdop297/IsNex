# **SSR – Definition**

**SSR (Server-Side Rendering)** _(render phía server)_
→ **The server fetches data, constructs the HTML for each request, and sends fully rendered content to the browser (trình duyệt).**
Client only hydrates what’s needed.

SSR = dynamic + SEO-friendly + secure data fetching.
It gives **fresh data every request** because rendering happens on demand.

---

## **SSR – Use Cases (chuẩn, gọn, thực tế)**

**1. Dynamic pages that must show fresh data (dữ liệu phải luôn mới)**

- Pricing that changes often
- Stock/market data
- Dashboard with up-to-date metrics
- Search results with real-time indexing

→ SSR đảm bảo server fetch mỗi request → không bị stale.

**2. Pages requiring SEO + dynamic data**

Khi nội dung thay đổi `theo request` **nhưng vẫn cần SEO**, ví dụ:

- Marketplace product pages
- News feed
- Blog with comments loaded per request
- Listings with filters from query params

SSR = SEO tốt + dynamic content.

**3. Auth-protected pages where data must be resolved on the server**

- User profile
- Account management
- Payment pages
- Personalized recommendations

Server kiểm tra token, cookie, session → bảo mật hơn CSR.

**4. Pages using sensitive keys or server-only credentials**

- Fetching from internal APIs
- Interacting với database
- Backend → server → render → client

Không lộ secret vì chạy hoàn toàn phía server.

**5. Preloading data for heavy client sections (bootstrapped UI)**

SSR có thể trả về initial HTML + initial data để client tiếp tục xử lý.
Ví dụ:

- Editor page load initial doc content từ SSR → UI client tiếp quản.
- Dashboard initializes with server data → client hydrates.

**6. Multi-tenant or region-specific content**

- Content khác nhau theo domain/subdomain
- Geo-based data (location, region)
- AB testing

SSR xử lý logic phân nhánh trên server rất tiện.

## **When NOT to use SSR**

- UI fully interactive (editor, canvas, drag-drop) → CSR
- Data rarely changes → SSG/ISR
- Heavy client-state logic (React Query) → CSR
- Simple static marketing pages → SSG

# Implementation
