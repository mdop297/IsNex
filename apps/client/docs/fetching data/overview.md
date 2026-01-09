# generate typescript Apis

command to use swagger typescript api to generate frontend api

```bash
cd src/lib/api
sta generate -p http://localhost:3001/swagger/json -o auth  --modular  <--axios>
sta generate -p http://localhost:4000/openapi.json -o core  --modular  --axios
```

=> after that, we have generated apis and type validations files in `src/lib/api/` folder.

# Types of fetching data to Nextjs

1. CSR (Client-Side Rendering) – render phía client
   (fetch/axios/react-query gọi ở browser)
   → Hợp data thay đổi nhiều, không cần SEO.

2. SSR (Server-Side Rendering) – render mỗi request
   (getServerSideProps hoặc fetch trong server route)
   → Data luôn fresh, hỗ trợ SEO, nhưng tốn chi phí render.

3. Server Components (RSC – render trên server, streaming)
   (fetch ngay trong component server)
   → Đây là cách then chốt thời Next.js 13+. Tối ưu SEO, performance, cache.

4. SSG (Static Site Generation) – render lúc build
   (getStaticProps)
   → Dùng cho data ít đổi (Landing, Documentation, Blog Post, article, ). Tốc độ cực nhanh. Có thể mở rộng bằng ISR để revalidate.
