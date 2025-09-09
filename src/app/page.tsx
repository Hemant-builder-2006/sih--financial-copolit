'use client';

import dynamic from 'next/dynamic';

// Dynamically import the React Flow component to avoid SSR issues
const ReactFlowCanvas = dynamic(() => import('./ReactFlowCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-lg text-gray-600">Loading Canvas...</div>
    </div>
  )
});

export default function Page() {
  return <ReactFlowCanvas />;
}
