'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart2, 
  CalendarDays, 
  Inbox, 
  Settings,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'Schedule', href: '/schedule', icon: CalendarDays },
  { name: 'Smart Box', href: '/smart-box', icon: Inbox },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-100 bg-white">
      {/* Logo Area */}
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
          <Sparkles size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">
          SocialMetrics
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#f4f5f8] text-gray-900' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-[#6366f1]' : ''} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Usage Widget (Bottom) */}
      <div className="p-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Usage
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200">
            <div className="h-1.5 w-3/4 rounded-full bg-[#6366f1]" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            75% of data credits used
          </p>
        </div>
      </div>
    </aside>
  );
}