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

## Full code

```typescript
// pages/users.tsx (hoặc app/users/page.tsx nếu dùng App Router)

import { useState, useEffect } from 'react';

// Định nghĩa kiểu dữ liệu
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function UsersPage() {
  // 1. Khởi tạo state để lưu data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Sử dụng useEffect để fetch data khi component mount
  useEffect(() => {
    // Hàm fetch data
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Gọi API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        // Kiểm tra response
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        // Parse JSON
        const data = await response.json();

        // Cập nhật state
        setUsers(data);
        setError(null);
      } catch (err) {
        // Xử lý lỗi
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching users:', err);
      } finally {
        // Tắt loading
        setLoading(false);
      }
    };

    // Gọi hàm fetch
    fetchUsers();
  }, []); // Array rỗng = chỉ chạy 1 lần khi component mount

  // 3. Render UI dựa trên state

  // Hiển thị loading
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>Lỗi: {error}</p>
      </div>
    );
  }

  // Hiển thị dữ liệu
  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh sách Users (CSR)</h1>
      <p>Data được load từ client-side sau khi trang render</p>

      <div style={{ marginTop: '20px' }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '5px'
            }}
          >
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Phân tích chi tiết các bước

Bước 1: Khởi tạo State

```typescript
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

- `users`: Lưu data sau khi fetch
- `loading`: Theo dõi trạng thái loading
- `error`: Lưu thông báo lỗi nếu có

Bước 2: useEffect để fetch data

```typescript
useEffect(() => {
  fetchUsers();
}, []);
```

- `[]` dependency array rỗng = chỉ chạy 1 lần khi component mount
- Nếu có dependency, sẽ chạy lại khi dependency thay đổi

Bước 3: Xử lý các trạng thái

- Loading state: Hiển thị spinner/text khi đang load
- Error state: Hiển thị thông báo lỗi
- Success state: Hiển thị data

## Advanced example with SWR/React Query

```typescript
// Cài đặt: npm install swr

import useSWR from 'swr';

interface User {
  id: number;
  name: string;
  email: string;
}

// Hàm fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UsersWithSWR() {
  // SWR tự động xử lý loading, error, caching, revalidation
  const { data: users, error, isLoading } = useSWR<User[]>(
    'https://jsonplaceholder.typicode.com/users',
    fetcher,
    {
      // Options
      revalidateOnFocus: false, // Không refetch khi focus lại window
      revalidateOnReconnect: true, // Refetch khi có kết nối lại
      refreshInterval: 0, // Không auto refresh (set số ms nếu muốn)
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Users với SWR</h1>
      {users?.map(user => (
        <div key={user.id} style={{ marginBottom: '10px' }}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// VÍ DỤ VỚI REACT QUERY
// Cài đặt: npm install @tanstack/react-query
// ============================================

import { useQuery } from '@tanstack/react-query';

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

export function UsersWithReactQuery() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'], // Unique key cho cache
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // Data fresh trong 5 phút
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Users với React Query</h1>
      {users?.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```
