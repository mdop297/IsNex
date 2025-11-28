```typescript
// app/users/page.tsx
// Next.js 13+ App Router - Server Component by default

import { Metadata } from 'next';

// ==================== TYPES ====================
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

// ==================== SEO METADATA ====================
export const metadata: Metadata = {
  title: 'Danh sách Users - SSR',
  description: 'Danh sách users được load với Server Components',
  openGraph: {
    title: 'Danh sách Users',
    description: 'Server-side rendered user list',
  },
};

// ==================== DATA FETCHING FUNCTION ====================
async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      // Best Practice 1: Cache control
      next: {
        revalidate: 60 // Revalidate every 60 seconds (ISR)
        // revalidate: 0 // Always fresh (true SSR)
        // revalidate: false // Cache forever
      },

      // Best Practice 2: Set timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error; // Will be caught by error.tsx
  }
}

// ==================== SERVER COMPONENT ====================
export default async function UsersPage() {
  // Fetch data directly in component (Server Component)
  const users = await getUsers();
  const timestamp = new Date().toISOString();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Danh sách Users (App Router SSR)</h1>
      <p style={{ color: '#666' }}>
        Server Component - Data fetched lúc: {new Date(timestamp).toLocaleString('vi-VN')}
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        ✅ SEO Perfect | ⚡ No client JavaScript needed | 🔄 Auto revalidate 60s
      </p>

      <div style={{ marginTop: '30px' }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '15px',
              backgroundColor: '#fafafa',
            }}
          >
            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
              {user.name}
            </h2>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Website:</strong> {user.website}</p>
              <p><strong>Company:</strong> {user.company.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== OPTIONAL: LOADING STATE ====================
// Create app/users/loading.tsx
export default function Loading() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Đang tải dữ liệu...</p>
    </div>
  );
}

// ==================== OPTIONAL: ERROR HANDLING ====================
// Create app/users/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h2>Có lỗi xảy ra!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Thử lại</button>
    </div>
  );
}

```
