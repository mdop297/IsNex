```typescript
// ==========================================
// BEST PRACTICES FOR SSR IN NEXT.JS
// ==========================================

// 1️⃣ USE TYPESCRIPT FOR TYPE SAFETY
interface User {
  id: number;
  name: string;
  email: string;
}

// 2️⃣ PARALLEL DATA FETCHING
// ❌ BAD: Sequential fetching (slow)
async function fetchDataBad(userId: string) {
  const user = await fetch(`/api/users/${userId}`).then(r => r.json());
  const posts = await fetch(`/api/posts?userId=${userId}`).then(r => r.json());
  return { user, posts };
}

// ✅ GOOD: Parallel fetching (fast)
async function fetchDataGood(userId: string) {
  const [user, posts] = await Promise.all([
    fetch(`/api/users/${userId}`).then(r => r.json()),
    fetch(`/api/posts?userId=${userId}`).then(r => r.json()),
  ]);
  return { user, posts };
}

// 3️⃣ ERROR HANDLING & TIMEOUTS
async function fetchWithErrorHandling(url: string) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000), // 5s timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout');
      }
      console.error('Fetch error:', error.message);
    }
    throw error;
  }
}

// 4️⃣ CACHING STRATEGIES (App Router)
// a) No caching (always fresh)
fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// b) Revalidate after time (ISR)
fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // 1 hour
});

// c) Cache forever (SSG)
fetch('https://api.example.com/data', {
  cache: 'force-cache'
});

// d) Tag-based revalidation
fetch('https://api.example.com/data', {
  next: { tags: ['users'] }
});
// Revalidate from API: revalidateTag('users')

// 5️⃣ REDIRECT & NOT FOUND (Pages Router)
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  // Check authentication
  const session = context.req.cookies.session;
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false, // 307 temporary redirect
      },
    };
  }

  // Check if resource exists
  const user = await fetchUser(id);
  if (!user) {
    return {
      notFound: true, // Shows 404 page
    };
  }

  return {
    props: { user },
  };
};

// 6️⃣ REDIRECT & NOT FOUND (App Router)
import { notFound, redirect } from 'next/navigation';

async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function UserPage({ params }: { params: { id: string } }) {
  // Check auth (example)
  const session = null; // Get from cookies/headers
  if (!session) {
    redirect('/login');
  }

  const user = await fetchUser(params.id);
  if (!user) {
    notFound(); // Shows not-found.tsx
  }

  return <div>User: {user.name}</div>;
}

// 7️⃣ ENVIRONMENT VARIABLES
// Use server-side env vars safely
export const getServerSideProps: GetServerSideProps = async () => {
  const apiKey = process.env.API_KEY; // Only available server-side
  const publicUrl = process.env.NEXT_PUBLIC_API_URL; // Available both sides

  const data = await fetch(`${publicUrl}/data`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  }).then(r => r.json());

  return { props: { data } };
};

// 8️⃣ CONDITIONAL PROPS
export const getServerSideProps: GetServerSideProps = async (context) => {
  const isPreview = context.preview || false;

  const response = await fetch(
    isPreview
      ? 'https://api.example.com/draft-posts'
      : 'https://api.example.com/published-posts'
  );

  return {
    props: {
      posts: await response.json(),
      isPreview,
    },
  };
};

// 9️⃣ ACCESSING REQUEST DATA (Pages Router)
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Access cookies
  const token = context.req.cookies.token;

  // Access headers
  const userAgent = context.req.headers['user-agent'];

  // Access IP
  const ip = context.req.socket.remoteAddress;

  // Access query params
  const { page, limit } = context.query;

  // Set response headers
  context.res.setHeader('Cache-Control', 'public, max-age=3600');

  return {
    props: {
      page: page || '1',
      limit: limit || '10',
    },
  };
};

// 🔟 ACCESSING REQUEST DATA (App Router)
import { cookies, headers } from 'next/headers';

export default async function Page() {
  // Access cookies
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  // Access headers
  const headersList = headers();
  const userAgent = headersList.get('user-agent');

  return <div>User Agent: {userAgent}</div>;
}

// 1️⃣1️⃣ STREAMING SSR (App Router)
import { Suspense } from 'react';

async function SlowData() {
  const data = await fetch('https://slow-api.com/data', {
    cache: 'no-store'
  }).then(r => r.json());

  return <div>{data.content}</div>;
}

export default function StreamingPage() {
  return (
    <div>
      <h1>Fast Header (loads immediately)</h1>

      {/* Slow content streams after ready */}
      <Suspense fallback={<div>Loading slow data...</div>}>
        <SlowData />
      </Suspense>
    </div>
  );
}

// 1️⃣2️⃣ REVALIDATE ON-DEMAND (App Router)
// In API Route: app/api/revalidate/route.ts

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // Revalidate specific path
  revalidatePath('/users');

  // Or revalidate by tag
  revalidateTag('users');

  return Response.json({ revalidated: true, now: Date.now() });
}
```

## Performance tips

```typescript
// ✅ DO: Minimize server work
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetchMinimalData(); // Only fetch what you need

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)), // Serialize properly
    },
  };
};

// ❌ DON'T: Heavy computation on server
export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetchAllData();
  const processed = heavyComputation(data); // Bad! Use API route or client

  return { props: { processed } };
};

// ✅ DO: Set cache headers for CDN
export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

  const data = await fetchData();
  return { props: { data } };
};
```
