# **1️⃣ CSR – Client-Side Rendering**

**Đặc điểm nhận dạng:**

- Fetch data **trên browser** (useEffect, React Query, fetch/axios)
- Stateful, có event handler (`onClick`, `onChange`)
- Initial HTML **trống hoặc skeleton** → SEO kém
- Data update **chỉ khi refetch hoặc reload**

**Khi dùng:**

- Real-time UI: LLM streaming, collaboration, live stock prices
- Forms, editors, dashboards
- Multi-step interactions, local state-heavy UI

---

# **2️⃣ SSR – Server-Side Rendering**

**Đặc điểm nhận dạng:**

- Fetch data **mỗi request trên server**
- Initial HTML có data → SEO tốt
- Không tự update khi client đứng yên
- Thường dùng `getServerSideProps`

**Khi dùng:**

- Dashboard, profile, auth-protected pages
- Product pages, news feed cần SEO + dynamic content
- Region-specific content

---

# **3️⃣ RSC – Server Components**

**Đặc điểm nhận dạng:**

- Component **render trên server**, fetch backend trực tiếp
- Không dùng `useState`, `useEffect`, event handler
- Minimal JS bundle → nhanh, SEO tốt
- Có thể stream HTML

**Khi dùng:**

- Initial render danh sách notes, documents, highlights
- Pages với sensitive API keys
- Layout / skeleton UI
- Data thay đổi không quá nhanh hoặc có caching/revalidate

---

# **4️⃣ SSG – Static Site Generation**

**Đặc điểm nhận dạng:**

- Fetch data **lúc build**, HTML tĩnh
- SEO cực tốt, tốc độ nhanh
- Data **ít đổi** → có thể dùng ISR để revalidate
- Thường dùng `getStaticProps`

**Khi dùng:**

- Landing page, blog, documentation, marketing pages
- Product catalog ít đổi, changelog
- Public content không phụ thuộc user

---

# **Tóm tắt để dễ quyết định:**

| Feature             | CSR           | SSR                        | RSC                  | SSG                     |
| ------------------- | ------------- | -------------------------- | -------------------- | ----------------------- |
| Where rendered      | Browser       | Server per request         | Server               | Server at build         |
| SEO friendly        | ✗             | ✅                         | ✅                   | ✅                      |
| Real-time / dynamic | ✅            | ✅ (on reload)             | ✗ (needs CSR inside) | ✗                       |
| Interactivity       | ✅            | ✅ (via client components) | ✗                    | ✗                       |
| Data freshness      | Needs refetch | Always fresh               | Fresh per fetch      | Build-time / revalidate |

---

# **Kết hợp được không?**

- **RSC + CSR** → Server fetch initial data, client handle interaction (most common)
- **SSR + CSR** → SSR load fresh page, client update realtime/polling
- **SSG + CSR** → Static page + client interactivity (comments, likes, live widgets)

**Insight:**

- Server-side (SSR/RSC/SSG) = load data nhanh, SEO tốt, bảo mật
- Client-side (CSR) = xử lý tương tác real-time, state-heavy

> Quy tắc gọn:
>
> - **SEO/static → SSG**
> - **Dynamic/fresh → SSR/RSC**
> - **Interactive/realtime → CSR**
> - **Kết hợp server fetch + client interaction = pattern chuẩn Next.js 16**
