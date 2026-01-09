```typescript
// app/dashboard/page.tsx
// 🚀 Streaming RSC - Components load progressively

import { Suspense } from 'react';

// ==================== TYPES ====================
interface Stats {
  users: number;
  revenue: number;
  orders: number;
}

interface RecentOrder {
  id: number;
  customer: string;
  amount: number;
  status: string;
}

// ==================== FAST DATA (loads quickly) ====================
async function getStats(): Promise<Stats> {
  // Simulate fast API
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    users: 1234,
    revenue: 45678,
    orders: 890,
  };
}

// ==================== SLOW DATA (takes time) ====================
async function getRecentOrders(): Promise<RecentOrder[]> {
  // Simulate slow API (3 seconds)
  await new Promise(resolve => setTimeout(resolve, 3000));

  return [
    { id: 1, customer: 'John Doe', amount: 299.99, status: 'completed' },
    { id: 2, customer: 'Jane Smith', amount: 149.99, status: 'pending' },
    { id: 3, customer: 'Bob Wilson', amount: 499.99, status: 'completed' },
  ];
}

// ==================== VERY SLOW DATA ====================
async function getAnalytics() {
  await new Promise(resolve => setTimeout(resolve, 5000));

  return {
    impressions: 12345,
    clicks: 678,
    conversions: 89,
  };
}

// ==================== MAIN PAGE (Server Component) ====================
export default function DashboardPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>📊 Dashboard (Streaming RSC)</h1>

      <div style={{
        backgroundColor: '#e8f5e9',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p><strong>⚡ Streaming Benefits:</strong></p>
        <ul style={{ marginBottom: 0 }}>
          <li>✅ Fast content appears immediately</li>
          <li>✅ Slow content loads progressively</li>
          <li>✅ Better perceived performance</li>
          <li>✅ No blocking - parallel loading</li>
        </ul>
      </div>

      {/* FAST SECTION - Loads immediately */}
      <Suspense fallback={<StatsLoading />}>
        <StatsSection />
      </Suspense>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '20px'
      }}>
        {/* SLOW SECTION 1 - Loads after 3s */}
        <Suspense fallback={<SectionLoading title="Recent Orders" />}>
          <RecentOrdersSection />
        </Suspense>

        {/* SLOW SECTION 2 - Loads after 5s */}
        <Suspense fallback={<SectionLoading title="Analytics" />}>
          <AnalyticsSection />
        </Suspense>
      </div>
    </div>
  );
}

// ==================== FAST COMPONENT ====================
async function StatsSection() {
  const stats = await getStats();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '20px'
    }}>
      <StatCard
        title="Total Users"
        value={stats.users.toLocaleString()}
        icon="👥"
        color="#2196f3"
      />
      <StatCard
        title="Revenue"
        value={`$${stats.revenue.toLocaleString()}`}
        icon="💰"
        color="#4caf50"
      />
      <StatCard
        title="Orders"
        value={stats.orders.toLocaleString()}
        icon="📦"
        color="#ff9800"
      />
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div style={{
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: color,
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '36px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>
        {value}
      </div>
      <div style={{ fontSize: '14px', opacity: 0.9 }}>{title}</div>
    </div>
  );
}

// ==================== SLOW COMPONENT 1 ====================
async function RecentOrdersSection() {
  const orders = await getRecentOrders();

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e0e0e0'
    }}>
      <h2 style={{ marginTop: 0 }}>📋 Recent Orders</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {orders.map(order => (
          <div
            key={order.id}
            style={{
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>{order.customer}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Order #{order.id}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: '#4caf50' }}>
                ${order.amount}
              </div>
              <div style={{
                fontSize: '12px',
                color: order.status === 'completed' ? '#4caf50' : '#ff9800',
                textTransform: 'uppercase'
              }}>
                {order.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== SLOW COMPONENT 2 ====================
async function AnalyticsSection() {
  const analytics = await getAnalytics();

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e0e0e0'
    }}>
      <h2 style={{ marginTop: 0 }}>📈 Analytics</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <AnalyticItem
          label="Impressions"
          value={analytics.impressions.toLocaleString()}
          color="#2196f3"
        />
        <AnalyticItem
          label="Clicks"
          value={analytics.clicks.toLocaleString()}
          color="#4caf50"
        />
        <AnalyticItem
          label="Conversions"
          value={analytics.conversions.toLocaleString()}
          color="#f44336"
        />
      </div>
    </div>
  );
}

function AnalyticItem({ label, value, color }: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      <span style={{ fontWeight: 'bold' }}>{label}</span>
      <span style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color
      }}>
        {value}
      </span>
    </div>
  );
}

// ==================== LOADING SKELETONS ====================
function StatsLoading() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '20px'
    }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            height: '120px',
            borderRadius: '12px',
            backgroundColor: '#e0e0e0',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      ))}
    </div>
  );
}

function SectionLoading({ title }: { title: string }) {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e0e0e0'
    }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div style={{
        height: '200px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999'
      }}>
        Loading...
      </div>
    </div>
  );
}
```
