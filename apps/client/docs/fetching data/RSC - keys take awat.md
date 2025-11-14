# React Server Components (RSC) - Best Practices

## 🎯 Quy tắc Server vs Client Components

### ✅ Dùng SERVER COMPONENT khi:

- Fetch data từ database/API
- Access backend resources (file system, env vars)
- Keep sensitive data on server (API keys, tokens)
- Reduce client JavaScript bundle
- Không cần interactivity

### ✅ Dùng CLIENT COMPONENT khi:

- Cần useState, useEffect, useContext
- Cần event handlers (onClick, onChange)
- Dùng browser APIs (localStorage, window)
- Dùng React hooks khác
- Third-party libraries cần browser

---

## 📋 Component Composition Patterns

### Pattern 1: Server Component chứa Client Component

```tsx
// ✅ GOOD: Server parent, Client child
export default async function Page() {
  const data = await fetchData(); // Server-side

  return (
    <div>
      <h1>{data.title}</h1>
      <InteractiveButton data={data} /> {/* Client Component */}
    </div>
  );
}
```

### Pattern 2: Client Component KHÔNG THỂ import Server Component trực tiếp

```tsx
// ❌ BAD: Client importing Server Component
'use client';
import ServerComponent from './ServerComponent'; // Error!

export default function ClientComponent() {
  return <ServerComponent />;
}
```

### Pattern 3: Pass Server Component as children/props

```tsx
// ✅ GOOD: Pass Server Component via props
export default async function Page() {
  return (
    <ClientWrapper>
      <ServerContent /> {/* Server Component */}
    </ClientWrapper>
  );
}

// Client Component nhận children
('use client');
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div onClick={() => setOpen(!open)}>{children}</div>;
}
```

---

## 🚀 Data Fetching Best Practices

### 1. Parallel Fetching

```tsx
// ✅ GOOD: Fetch in parallel
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);

// ❌ BAD: Sequential fetching (slow)
const users = await fetchUsers();
const posts = await fetchPosts();
```

### 2. Request Deduplication

```tsx
// Next.js automatically dedupes identical requests
async function getUser(id: string) {
  return fetch(`/api/users/${id}`); // Cached automatically
}

// Both calls only fetch once!
const user1 = await getUser('123');
const user2 = await getUser('123');
```

### 3. Cache Configuration

```tsx
// Always fresh (SSR)
fetch('/api/data', { cache: 'no-store' });

// Static (SSG)
fetch('/api/data', { cache: 'force-cache' });

// ISR with revalidation
fetch('/api/data', {
  next: { revalidate: 60 }, // 60 seconds
});

// Tag-based revalidation
fetch('/api/data', {
  next: { tags: ['posts'] },
});
// Then: revalidateTag('posts')
```

---

## ⚡ Performance Optimization

### 1. Use Suspense for Progressive Loading

```tsx
export default function Page() {
  return (
    <>
      {/* Fast content loads first */}
      <FastSection />

      {/* Slow content streams after */}
      <Suspense fallback={<Loading />}>
        <SlowSection />
      </Suspense>
    </>
  );
}
```

### 2. Minimize Client JavaScript

```tsx
// ❌ BAD: Entire component is client-side
'use client';
export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Static Title</h1>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}

// ✅ GOOD: Only button is client-side
export default function Page() {
  return (
    <div>
      <h1>Static Title</h1> {/* Server Component */}
      <Counter /> {/* Client Component */}
    </div>
  );
}
```

### 3. Preload Data

```tsx
import { preload } from 'react-dom';

export default async function Page() {
  // Preload data before rendering
  preload('/api/critical-data', { as: 'fetch' });

  const data = await fetch('/api/critical-data');
  return <div>{data.content}</div>;
}
```

---

## 🔒 Security Best Practices

### 1. Never Expose Secrets to Client

```tsx
// ✅ GOOD: API key stays on server
export default async function ServerComponent() {
  const data = await fetch('https://api.example.com/data', {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`, // Safe!
    },
  });

  return <div>{data.content}</div>;
}

// ❌ BAD: API key in Client Component
('use client');
export default function ClientComponent() {
  useEffect(() => {
    fetch('https://api.example.com/data', {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`, // Exposed!
      },
    });
  }, []);
}
```

### 2. Validate Input in Server Actions

```tsx
'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export async function createUser(formData: FormData) {
  // Validate on server
  const data = schema.parse({
    email: formData.get('email'),
    name: formData.get('name'),
  });

  // Safe to proceed
  await db.user.create({ data });
}
```

---

## 📊 Caching Strategies

### When to use each strategy:

| Strategy        | Use Case          | Example                        |
| --------------- | ----------------- | ------------------------------ |
| `no-store`      | Always fresh data | User dashboard, real-time data |
| `force-cache`   | Static data       | Blog posts, documentation      |
| `revalidate: N` | Periodic updates  | Product listings, news         |
| Tag-based       | On-demand updates | After mutations                |

### Example: E-commerce Site

```tsx
// Product detail: ISR with revalidation
async function getProduct(id: string) {
  return fetch(`/api/products/${id}`, {
    next: {
      revalidate: 3600, // 1 hour
      tags: [`product-${id}`],
    },
  });
}

// Cart: Always fresh
async function getCart(userId: string) {
  return fetch(`/api/cart/${userId}`, {
    cache: 'no-store',
  });
}

// Categories: Static
async function getCategories() {
  return fetch('/api/categories', {
    cache: 'force-cache',
  });
}
```

---

## 🎨 Styling Considerations

### Server Components can use:

- ✅ CSS Modules
- ✅ Tailwind CSS
- ✅ Inline styles
- ✅ CSS-in-JS (if no runtime required)

### Client Components require:

- ⚠️ CSS-in-JS with runtime (styled-components, emotion)
- Use `'use client'` directive

---

## 🔄 Data Mutations

### Use Server Actions for mutations:

```tsx
// app/actions.ts
'use server';

export async function updatePost(id: string, data: any) {
  await db.post.update({ where: { id }, data });

  // Revalidate affected paths
  revalidatePath('/blog');
  revalidatePath(`/blog/${id}`);

  // Or revalidate by tag
  revalidateTag('posts');
}

// Client Component calls it
('use client');
import { updatePost } from './actions';

export function EditForm({ postId }: { postId: string }) {
  async function handleSubmit(formData: FormData) {
    await updatePost(postId, {
      title: formData.get('title'),
    });
  }

  return (
    <form action={handleSubmit}>
      <input name="title" />
      <button type="submit">Update</button>
    </form>
  );
}
```

---

## 🐛 Common Mistakes to Avoid

### 1. ❌ Using hooks in Server Components

```tsx
// ❌ BAD
export default async function ServerComponent() {
  const [state, setState] = useState(0); // Error!
  return <div>{state}</div>;
}
```

### 2. ❌ Forgetting 'use client' directive

```tsx
// ❌ BAD
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0); // Error!
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ GOOD
('use client');
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 3. ❌ Over-using Client Components

```tsx
// ❌ BAD: Entire page is client-side
'use client';
export default function Page() {
  return (
    <div>
      <Header /> {/* Could be server */}
      <Content /> {/* Could be server */}
      <InteractiveWidget /> {/* Only this needs client */}
    </div>
  );
}

// ✅ GOOD: Minimize client JavaScript
export default function Page() {
  return (
    <div>
      <Header />
      <Content />
      <InteractiveWidget /> {/* Only this is 'use client' */}
    </div>
  );
}
```

---

## 📈 Migration Tips

### From SSR (getServerSideProps) to RSC:

**Before (Pages Router):**

```tsx
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

export default function Page({ data }: { data: any }) {
  return <div>{data.title}</div>;
}
```

**After (App Router RSC):**

```tsx
async function getData() {
  return await fetchData();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

---

## 🎯 Key Takeaways

1. **Default to Server Components** - only use Client when needed
2. **Fetch data close to where it's used** - components can fetch their own data
3. **Use Suspense for progressive loading** - better UX
4. **Minimize client JavaScript** - smaller bundles, faster loads
5. **Keep secrets on server** - never expose API keys
6. **Use proper caching strategy** - balance freshness and performance
7. **Leverage parallel fetching** - faster data loading
8. **Use Server Actions** - for mutations and form handling
