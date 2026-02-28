// src/app/page.tsx
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Social Studio</h1>
        
        <div className="mt-12">
          {/* Put your freshly synced Profile ID here! */}
          <AnalyticsDashboard profileId="195825666953002" />
        </div>
        
      </div>
    </main>
  );
}