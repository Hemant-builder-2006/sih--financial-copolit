'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      router.replace('/ai-canvas');
    }
  }, [router, pathname]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🎨 Poppy AI Canvas</h1>
        <p>Redirecting to AI Canvas...</p>
        <div style={{ marginTop: '20px' }}>
          <a 
            href="/ai-canvas"
            style={{
              background: 'white',
              color: '#333',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            🚀 Launch AI Canvas
          </a>
        </div>
      </div>
    </div>
  );
}
