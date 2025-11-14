# **Server Component (RSC) – Definition**

**RSC (React Server Component)** _(thành phần React chạy phía server)_

- **Định nghĩa:**

> A component that is rendered on the server, fetches data directly from backend or DB, and sends serialized HTML/JSX to the client. It **does not run in the browser**, cannot use hooks like `useState`/`useEffect`, and doesn’t include event handlers.

- **Key points:**

  - Keep secrets safe (API keys, DB credentials)
  - Bundle JS shipped to client is minimal → faster load
  - Optimized for SEO and performance
  - Can stream HTML progressively
  - Client hydration only needed for interactive sub-components

---

# **Server Component – Use Cases**

| Use Case                                                                 | Why RSC fits                                                     |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Fetch & render initial data from backend**                             | Fast initial load, SEO-friendly, secure                          |
| **Render lists / tables of dynamic data** (notes, documents, highlights) | Data changes per user/session, but no immediate interaction      |
| **Pages that need SEO**                                                  | Server-generated HTML readable by search engines                 |
| **Pages with sensitive API calls**                                       | Keeps keys/secrets off the client                                |
| **Initial layout / skeleton UI**                                         | Can send static or semi-dynamic structure to client              |
| **Batch operations before hydration**                                    | Compute/transform data server-side → client just receives props  |
| **Content that changes occasionally**                                    | Combine with caching/revalidate for pragmatic hybrid (ISR style) |

---

# **Key Insight for IsNex:**

- **RSC = fetch & show data fast**
- **CSR inside RSC = handle interactivity** (click, editor, streaming)
- **Pattern:**

  - RSC fetch initial notes → render list
  - Client Component inside handles highlight, click, edit, LLM streaming
