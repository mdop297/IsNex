```typescript
// ==========================================
// FILE: lib/db.ts - Database utilities
// ==========================================

// Example with Prisma (you need to install: npm install @prisma/client)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ======================================

// For this example, we'll simulate database calls
export async function dbQuery<T>(
  query: string,
  params?: any[]
): Promise<T> {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // In real app: return await prisma.$queryRaw`${query}`;
  return {} as T;
}

// ==========================================
// FILE: app/blog/page.tsx - SERVER COMPONENT
// ==========================================

import { Suspense } from 'react';
import { notFound } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  views: number;
}

interface Author {
  id: number;
  name: string;
  email: string;
}

// ==================== DATA ACCESS LAYER ====================
// Best Practice: Separate data fetching functions

// ✅ DO: Create reusable data fetching functions
async function getPosts(): Promise<Post[]> {
  // Real implementation:
  // return await prisma.post.findMany({
  //   orderBy: { createdAt: 'desc' },
  //   take: 10,
  // });

  // Mock data
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10', {
    next: {
      revalidate: 300, // Cache for 5 minutes
      tags: ['posts'] // For revalidateTag
    }
  });

  return response.json();
}

async function getAuthor(authorId: number): Promise<Author | null> {
  // Real: return await prisma.user.findUnique({ where: { id: authorId } });

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${authorId}`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!response.ok) return null;
  return response.json();
}

async function incrementPostViews(postId: number) {
  // Real: await prisma.post.update({
  //   where: { id: postId },
  //   data: { views: { increment: 1 } }
  // });

  console.log(`Incremented views for post ${postId}`);
}

// ==================== SERVER COMPONENT ====================
export default async function BlogPage() {
  // ✅ Fetch data directly in Server Component
  const posts = await getPosts();

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>📝 Blog Posts (RSC + Database)</h1>

      <div style={{
        backgroundColor: '#f3e5f5',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <p><strong>🎯 RSC Database Benefits:</strong></p>
        <ul style={{ marginBottom: 0 }}>
          <li>✅ Direct database access (no API route needed)</li>
          <li>✅ No database credentials exposed to client</li>
          <li>✅ Automatic request deduplication</li>
          <li>✅ Built-in caching with revalidation</li>
          <li>✅ Parallel data fetching with Suspense</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.map((post) => (
          <Suspense
            key={post.id}
            fallback={<PostCardSkeleton />}
          >
            <PostCard post={post} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

// ==================== NESTED SERVER COMPONENT ====================
// Each PostCard fetches its own author data in parallel
async function PostCard({ post }: { post: Post }) {
  // ✅ Each card fetches author independently
  // Next.js automatically deduplicates identical requests
  const author = await getAuthor(post.userId);

  if (!author) {
    return null;
  }

  return (
    <article style={{
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}>
      <h2 style={{
        margin: '0 0 12px 0',
        fontSize: '24px',
        color: '#1976d2'
      }}>
        {post.title}
      </h2>

      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '15px',
        fontSize: '14px',
        color: '#666'
      }}>
        <span>👤 {author.name}</span>
        <span>📧 {author.email}</span>
      </div>

      <p style={{
        color: '#444',
        lineHeight: '1.6',
        margin: '0'
      }}>
        {post.body}
      </p>
    </article>
  );
}

function PostCardSkeleton() {
  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      padding: '24px',
      height: '180px',
      animation: 'pulse 1.5s ease-in-out infinite'
    }}>
      <div style={{
        height: '24px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '12px',
        width: '70%'
      }} />
      <div style={{
        height: '14px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '15px',
        width: '40%'
      }} />
      <div style={{
        height: '14px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '8px'
      }} />
      <div style={{
        height: '14px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        width: '90%'
      }} />
    </div>
  );
}

// ==========================================
// FILE: app/blog/[id]/page.tsx - Dynamic Route
// ==========================================

interface PageProps {
  params: { id: string };
}

async function getPost(id: string): Promise<Post | null> {
  // Real: return await prisma.post.findUnique({
  //   where: { id: parseInt(id) },
  //   include: { author: true }
  // });

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      next: { revalidate: 300 },
      cache: 'force-cache' // Or 'no-store' for always fresh
    }
  );

  if (!response.ok) return null;
  return response.json();
}

export default async function PostDetailPage({ params }: PageProps) {
  const post = await getPost(params.id);

  if (!post) {
    notFound(); // Shows 404 page
  }

  // ✅ Side effects in Server Components
  await incrementPostViews(post.id);

  const author = await getAuthor(post.userId);

  return (
    <article style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      {author && <p>By {author.name}</p>}
      <p>{post.body}</p>
    </article>
  );
}

// ✅ Generate static params for popular posts (SSG hybrid)
export async function generateStaticParams() {
  const posts = await getPosts();

  // Pre-render first 5 posts at build time
  return posts.slice(0, 5).map((post) => ({
    id: post.id.toString(),
  }));
}

// ✅ Dynamic metadata
export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(params.id);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.body.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.body,
    },
  };
}

// ==========================================
// FILE: app/actions.ts - Server Actions
// ==========================================


'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

// Server Actions can mutate data
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Validate
  if (!title || !content) {
    return { error: 'Title and content are required' };
  }

  // Insert to database
  // await prisma.post.create({
  //   data: { title, content, authorId: 1 }
  // });

  // Revalidate cache
  revalidateTag('posts');
  revalidatePath('/blog');

  return { success: true };
}

export async function deletePost(postId: number) {
  // await prisma.post.delete({ where: { id: postId } });

  revalidateTag('posts');
  revalidatePath('/blog');

  return { success: true };
}

```
