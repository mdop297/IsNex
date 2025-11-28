```typescript
// ==========================================
// FILE: app/products/page.tsx (SERVER COMPONENT)
// ==========================================

import { Suspense } from 'react';
import ProductCard from './ProductCard'; // Client Component
import ProductFilter from './ProductFilter'; // Client Component

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

// Server function - can access database directly
async function getProducts(): Promise<Product[]> {
  // ✅ This runs on server only
  // You could do: await db.products.findMany()

  const response = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  return response.json();
}

// ==================== SERVER COMPONENT ====================
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  // Fetch data on server
  const allProducts = await getProducts();

  // Filter based on URL params (server-side)
  let products = allProducts;

  if (searchParams.category) {
    products = products.filter(p =>
      p.category === searchParams.category
    );
  }

  if (searchParams.search) {
    products = products.filter(p =>
      p.title.toLowerCase().includes(searchParams.search!.toLowerCase())
    );
  }

  // Get unique categories for filter
  const categories = [...new Set(allProducts.map(p => p.category))];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>🛍️ Products (RSC + Client Components)</h1>

      <div style={{
        backgroundColor: '#fff3e0',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p><strong>🎯 Architecture:</strong></p>
        <ul style={{ marginBottom: 0 }}>
          <li>📦 Product list: <strong>Server Component</strong> (no JS)</li>
          <li>🎛️ Filter controls: <strong>Client Component</strong> (interactive)</li>
          <li>🃏 Product cards: <strong>Client Component</strong> (like button)</li>
        </ul>
      </div>

      {/* CLIENT COMPONENT - Interactive filter */}
      <ProductFilter
        categories={categories}
        currentCategory={searchParams.category}
      />

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {products.map((product) => (
          // CLIENT COMPONENT - Has interactive features
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
          Không tìm thấy sản phẩm
        </p>
      )}
    </div>
  );
}

// ==========================================
// FILE: app/products/ProductFilter.tsx (CLIENT COMPONENT)
// ==========================================
'use client'; // ⚡ This makes it a Client Component

import { useRouter, useSearchParams } from 'next/navigation';

interface ProductFilterProps {
  categories: string[];
  currentCategory?: string;
}

export default function ProductFilter({
  categories,
  currentCategory
}: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);

    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;

    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '250px' }}>
        <input
          type="text"
          name="search"
          placeholder="Tìm kiếm sản phẩm..."
          defaultValue={searchParams.get('search') || ''}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
      </form>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleCategoryChange('all')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: !currentCategory ? '#1976d2' : '#e0e0e0',
            color: !currentCategory ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: currentCategory === cat ? '#1976d2' : '#e0e0e0',
              color: currentCategory === cat ? 'white' : 'black',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// FILE: app/products/ProductCard.tsx (CLIENT COMPONENT)
// ==========================================
'use client';

import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '15px',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'contain',
          marginBottom: '15px'
        }}
      />

      <h3 style={{
        fontSize: '16px',
        margin: '0 0 10px 0',
        height: '48px',
        overflow: 'hidden'
      }}>
        {product.title}
      </h3>

      <p style={{
        fontSize: '14px',
        color: '#666',
        height: '60px',
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        {product.description}
      </p>

      <div style={{
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1976d2'
        }}>
          ${product.price}
        </span>

        <button
          onClick={() => setLiked(!liked)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
}
```
