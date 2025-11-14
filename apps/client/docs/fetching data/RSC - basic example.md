```typescript
// app/users/page.tsx
// ⚡ This is a SERVER COMPONENT by default in App Router

import { Suspense } from 'react';

// ==================== TYPES ====================
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

// ==================== DATA FETCHING ====================
// Fetch function - runs ONLY on server
async function getUsers(): Promise<User[]> {
  // ✅ You can access:
  // - Database directly
  // - File system
  // - Environment variables (secrets)
  // - Backend APIs without exposing keys

  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    // ISR: Revalidate every 60 seconds
    next: { revalidate: 60 },
    // Or: cache: 'no-store' for always fresh (SSR)
    // Or: cache: 'force-cache' for static (SSG)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

// ==================== SERVER COMPONENT ====================
export default async function UsersPage() {
  // ✅ Async component - fetch data directly
  // No useEffect, no useState needed!
  const users = await getUsers();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🚀 React Server Component Example</h1>

      <div style={{
        backgroundColor: '#e3f2fd',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>✨ Điểm đặc biệt của RSC:</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>✅ Zero JavaScript gửi cho component này</li>
          <li>✅ Fetch data trực tiếp trong component</li>
          <li>✅ Access database/file system trực tiếp</li>
          <li>✅ Không cần useState, useEffect</li>
          <li>✅ SEO perfect</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

// ==================== NESTED SERVER COMPONENT ====================
// Server Component có thể chứa Server Component khác
function UserCard({ user }: { user: User }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
    }}>
      <h2 style={{
        margin: '0 0 15px 0',
        color: '#1976d2',
        fontSize: '20px'
      }}>
        {user.name}
      </h2>
      <div style={{ fontSize: '14px', color: '#666' }}>
        <p style={{ margin: '8px 0' }}>
          <strong>📧 Email:</strong> {user.email}
        </p>
        <p style={{ margin: '8px 0' }}>
          <strong>📱 Phone:</strong> {user.phone}
        </p>
        <p style={{ margin: '8px 0' }}>
          <strong>🌐 Website:</strong> {user.website}
        </p>
      </div>
    </div>
  );
}

// ==================== METADATA (SEO) ====================
// Metadata API - chỉ work với Server Components
export async function generateMetadata() {
  const users = await getUsers();

  return {
    title: `Users List (${users.length} users)`,
    description: 'List of users fetched with React Server Components',
  };
}
```
