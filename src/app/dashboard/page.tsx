import React from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  MoreHorizontal, 
  FileText, 
  FileSpreadsheet
} from 'lucide-react';

// --- MOCK DATA ---
const kpiData = [
  { title: 'TOTAL ENGAGEMENT', value: '45.2k', trend: '+12.4%', isPositive: true },
  { title: 'TOTAL REACH', value: '1.2M', trend: '+8.1%', isPositive: true },
  { title: 'FOLLOWER GROWTH', value: '8.4k', trend: '-2.4%', isPositive: false },
  { title: 'POST PERFORMANCE', value: '94%', trend: '+24.0%', isPositive: true },
];

const platformData = [
  { name: 'Instagram', percentage: 65 },
  { name: 'Twitter (X)', percentage: 48 },
  { name: 'LinkedIn', percentage: 32 },
];

const upcomingPosts = [
  {
    id: 1,
    title: 'Product launch announcement - Phase 1',
    time: 'Tomorrow at 10:00 AM',
    platform: 'Instagram',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Customer testimonial spotlight',
    time: 'Oct 14 at 2:30 PM',
    platform: 'Twitter',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=100&auto=format&fit=crop'
  }
];

const recentReports = [
  { id: 1, name: 'September_Audit_Final.pdf', meta: '2 days ago • 4.2 MB', type: 'pdf' },
  { id: 2, name: 'Weekly_Performance_V2.csv', meta: '5 days ago • 1.1 MB', type: 'csv' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* 1. Page Header & Filters */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Real-time performance across your connected socials.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Calendar size={16} className="text-gray-400" />
            Last 30 days
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1">
            <button className="rounded-full bg-slate-800 px-4 py-1.5 text-sm font-medium text-white">
              All Platforms
            </button>
            <button className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
              Instagram
            </button>
            <button className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
              Twitter
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((kpi) => (
          <div key={kpi.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  {kpi.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <div className={`flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                kpi.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}>
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Chart Area (Mocked visual representation) */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Engagement Over Time</h2>
            <p className="text-sm text-gray-500">Daily engagement across all connected platforms</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            Export Report <Download size={16} />
          </button>
        </div>
        
        {/* Placeholder for actual Recharts/Chart.js implementation */}
        <div className="mt-8 h-64 w-full">
          <div className="flex h-full items-end justify-between gap-2 pb-4">
            {/* Generating random-looking bars to match your Figma layout */}
            {[40, 60, 50, 80, 75, 90, 85, 100, 95, 60, 70, 80, 110, 85, 45].map((height, i) => (
              <div 
                key={i} 
                className="w-full rounded-t-md bg-[#cbd5e1] hover:bg-[#94a3b8] transition-colors"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
            <span>Week 01</span>
            <span>Week 02</span>
            <span>Week 03</span>
            <span>Week 04</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grids */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Top Platforms */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h2 className="mb-6 text-base font-bold text-gray-900">Top Platforms by Engagement</h2>
          <div className="space-y-6">
            {platformData.map((platform) => (
              <div key={platform.name}>
                <div className="mb-2 flex justify-between text-sm font-semibold text-gray-900">
                  <span>{platform.name}</span>
                  <span>{platform.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div 
                    className="h-2 rounded-full bg-slate-700" 
                    style={{ width: `${platform.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Distribution (Mocked Donut) */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h2 className="mb-6 text-base font-bold text-gray-900">Content Distribution</h2>
          <div className="flex items-center gap-8">
            {/* CSS-only Donut Chart Mockup */}
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[12px] border-slate-600 border-r-slate-300 border-t-slate-300">
              <div className="text-center">
                <span className="block text-xl font-bold text-gray-900">100%</span>
                <span className="text-[10px] font-bold uppercase text-gray-400">Total</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-3 w-3 rounded-sm bg-slate-600" /> Videos (55%)
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-3 w-3 rounded-sm bg-slate-300" /> Images (25%)
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-3 w-3 rounded-sm bg-gray-200" /> Links (20%)
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Upcoming Posts</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Full Calendar</button>
          </div>
          <div className="space-y-4">
            {upcomingPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between rounded-xl border border-gray-50 p-3 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <img src={post.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.time} • {post.platform}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Reports</h2>
            <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">Archive</button>
          </div>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between rounded-xl border border-gray-50 p-3 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    {report.type === 'pdf' ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.meta}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}