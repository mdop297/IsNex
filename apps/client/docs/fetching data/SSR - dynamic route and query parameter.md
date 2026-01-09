```typescript
// ==========================================
// PAGES ROUTER: pages/users/[id].tsx
// ==========================================

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
}

interface UserDetailProps {
  user: User;
  posts: Post[];
  error?: string;
}

export default function UserDetail({ user, posts, error }: UserDetailProps) {
  const router = useRouter();

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Lỗi</h1>
        <p>{error}</p>
        <button onClick={() => router.push('/users')}>
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{user.name} - User Detail</title>
        <meta name="description" content={`Thông tin chi tiết về ${user.name}`} />
      </Head>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => router.push('/users')}
          style={{ marginBottom: '20px', padding: '8px 16px' }}
        >
          ← Quay lại
        </button>

        <div style={{
          border: '2px solid #007bff',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#f8f9fa'
        }}>
          <h1 style={{ margin: '0 0 15px 0' }}>{user.name}</h1>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address.street}, {user.address.city}</p>
        </div>

        <h2>Bài viết của {user.name}</h2>
        <div>
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px'
              }}
            >
              <h3>{post.title}</h3>
              <p style={{ color: '#666' }}>{post.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<UserDetailProps> = async (context) => {
  const { id } = context.params as { id: string };

  // Best Practice: Access query parameters
  const { sortBy } = context.query; // /users/1?sortBy=date

  try {
    // Best Practice: Parallel data fetching
    const [userResponse, postsResponse] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        signal: AbortSignal.timeout(5000),
      }),
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`, {
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    if (!userResponse.ok) {
      // Best Practice: Return notFound
      return { notFound: true };
    }

    const [user, posts] = await Promise.all([
      userResponse.json(),
      postsResponse.json(),
    ]);

    // Best Practice: Conditional logic based on query params
    let sortedPosts = posts;
    if (sortBy === 'title') {
      sortedPosts = posts.sort((a: Post, b: Post) =>
        a.title.localeCompare(b.title)
      );
    }

    return {
      props: {
        user,
        posts: sortedPosts,
      },
    };

  } catch (error) {
    console.error('Error:', error);

    return {
      props: {
        user: {} as User,
        posts: [],
        error: 'Không thể tải dữ liệu',
      },
    };
  }
};

// ==========================================
// APP ROUTER: app/users/[id]/page.tsx
// ==========================================


interface PageProps {
  params: { id: string };
  searchParams: { sortBy?: string };
}

async function getUserData(id: string) {
  const [userRes, postsRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      next: { revalidate: 60 },
    }),
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`, {
      next: { revalidate: 60 },
    }),
  ]);

  if (!userRes.ok) throw new Error('User not found');

  return {
    user: await userRes.json(),
    posts: await postsRes.json(),
  };
}

export default async function UserDetailPage({ params, searchParams }: PageProps) {
  const { user, posts } = await getUserData(params.id);

  let displayPosts = posts;
  if (searchParams.sortBy === 'title') {
    displayPosts = [...posts].sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>

      <h2>Bài viết</h2>
      {displayPosts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

// Generate static params (optional, for static generation)
export async function generateStaticParams() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();

  return users.map((user: User) => ({
    id: user.id.toString(),
  }));
}

```
