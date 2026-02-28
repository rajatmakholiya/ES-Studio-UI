'use client';

import { useEffect, useState } from 'react';
import { Database, LayoutTemplate, Calendar, Loader2, ExternalLink } from 'lucide-react';

interface UnifiedAnalyticsData {
  isFetchingHistorical?: boolean; 
  profile: {
    name: string;
    platform: string;
    followers: number;
    engagementRate: string;
  };
  dailySnapshots: Array<{ 
    date: string;
    followersGained: number;
    reach: number;
    engagement: number;
    unfollows: number;
    profileClicks: number;
  }>;
  demographics: {
    ageGender: Record<string, number>;
  };
  recentPosts: Array<{
    _id: string;
    postId: string;
    postType: string;
    message: string;
    mediaUrl: string;
    thumbnailUrl: string;
    permalink: string;
    isPublished: boolean;
    isBoosted: boolean;
    authorName: string;
    postedAt: string;
    metrics: { likes: number; comments: number; shares: number; reach: number; views: number; clicks: number; };
  }>;
}

export default function AnalyticsDashboard({ profileId }: { profileId: string }) {
  const [data, setData] = useState<UnifiedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [days, setDays] = useState<number>(90);
  const [viewMode, setViewMode] = useState<'ui' | 'json'>('ui');

  const fetchData = async (hideLoader = false) => {
    if (!hideLoader) setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/analytics/${profileId}/data?days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json = await res.json();
      setData(json);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) fetchData();
  }, [profileId, days]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (data?.isFetchingHistorical) {
      interval = setInterval(() => {
        fetchData(true); 
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [data?.isFetchingHistorical, profileId, days]);

  if (loading && !data) return <div className="p-8 text-white font-mono animate-pulse">Fetching Data from Database...</div>;
  if (error) return <div className="p-8 text-red-500 font-mono">Error: {error}</div>;
  if (!data) return null;

  const { profile, dailySnapshots, demographics, recentPosts, isFetchingHistorical } = data;

  const totalEngagements = recentPosts?.reduce((sum, post) => sum + post.metrics.likes + post.metrics.comments + post.metrics.shares, 0) || 0;
  const calculatedEngRate = profile?.followers > 0 ? ((totalEngagements / profile.followers) * 100).toFixed(2) + '%' : '0.00%';

  const latestSnapshot = dailySnapshots && dailySnapshots.length > 0 
    ? dailySnapshots[dailySnapshots.length - 1] 
    : { followersGained: 0, reach: 0, engagement: 0, unfollows: 0, profileClicks: 0 };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200 font-sans mt-8 rounded-xl border border-gray-700 relative">
      
      <div className="mb-6 flex flex-wrap justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-700 gap-4">
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-1.5">
          <Calendar size={14} className="text-gray-400" />
          <select 
            className="bg-transparent text-sm font-semibold text-white outline-none cursor-pointer"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 3 Months</option>
            <option value={180}>Last 6 Months</option>
          </select>
        </div>

        {isFetchingHistorical && (
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full animate-pulse border border-indigo-500/20">
            <Loader2 size={14} className="animate-spin" />
            Fetching older data from Meta...
          </div>
        )}

        <div className="flex gap-2 bg-gray-900 p-1 rounded-md">
          <button onClick={() => setViewMode('ui')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${viewMode === 'ui' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <LayoutTemplate size={14} /> UI View
          </button>
          <button onClick={() => setViewMode('json')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${viewMode === 'json' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <Database size={14} /> Raw JSON
          </button>
        </div>
      </div>

      {viewMode === 'json' ? (
        <div className="bg-black p-4 rounded-lg overflow-x-auto border border-gray-800">
          <pre className="text-green-400 font-mono text-xs leading-relaxed">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <>
          <div className="mb-8 border-b border-gray-800 pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{profile?.name} <span className="text-sm font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded uppercase tracking-wider ml-2">{profile?.platform}</span></h1>
              <div className="flex gap-8 mt-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total Followers</p>
                  <p className="text-2xl font-semibold text-white">{profile?.followers?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Recent Engagement Rate</p>
                  <p className="text-2xl font-semibold text-purple-400">{calculatedEngRate}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Post Database View (With New Fields)</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-800 text-gray-400">
                  <tr>
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Media</th>
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Content Preview</th>
                    <th className="p-3 font-medium">Author / Status</th>
                    <th className="p-3 font-medium text-right">Reach</th>
                    <th className="p-3 font-medium text-right">Engage</th>
                    <th className="p-3 font-medium text-center">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900 font-mono text-xs">
                  {!recentPosts || recentPosts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-500">No posts in database. Wait for sync to complete.</td>
                    </tr>
                  ) : (
                    recentPosts.map((post) => {
                      const totalEng = post.metrics.likes + post.metrics.comments + post.metrics.shares + post.metrics.clicks;
                      return (
                        <tr key={post._id} className="hover:bg-gray-800/50 transition-colors">
                          <td className="p-3 text-gray-400">
                            {new Date(post.postedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            {post.thumbnailUrl ? (
                              <img src={post.thumbnailUrl} alt="thumb" className="w-10 h-10 object-cover rounded bg-gray-800" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-600 border border-gray-700 text-[9px]">N/A</div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-[10px] text-gray-300">
                              {post.postType}
                            </span>
                          </td>
                          <td className="p-3 max-w-[200px] truncate text-gray-300" title={post.message}>
                            {post.message || <span className="italic text-gray-600">No text</span>}
                          </td>
                          <td className="p-3 space-y-1">
                            <div className="text-gray-300 truncate w-32" title={post.authorName}>{post.authorName}</div>
                            <div className="flex gap-1">
                              {!post.isPublished && <span className="bg-red-900/30 text-red-400 border border-red-800/50 px-1 py-0.5 rounded text-[9px] uppercase tracking-wider">Unpub</span>}
                              {post.isBoosted && <span className="bg-purple-900/30 text-purple-400 border border-purple-800/50 px-1 py-0.5 rounded text-[9px] uppercase tracking-wider">Boost</span>}
                              {post.isPublished && !post.isBoosted && <span className="bg-green-900/30 text-green-400 border border-green-800/50 px-1 py-0.5 rounded text-[9px] uppercase tracking-wider">Pub</span>}
                            </div>
                          </td>
                          <td className="p-3 text-right text-blue-400 font-semibold">{post.metrics.reach?.toLocaleString() || 0}</td>
                          <td className="p-3 text-right text-indigo-400 font-semibold">{totalEng.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            {post.permalink ? (
                              <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="inline-block text-gray-500 hover:text-blue-400 transition-colors">
                                <ExternalLink size={16} />
                              </a>
                            ) : (
                              <span className="text-gray-700">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}