'use client';

import React, { useState, useEffect } from 'react';
import { 
  Facebook, 
  Instagram, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  CheckSquare, 
  Square, 
  Search,
  Loader2,
  Clock,
  RefreshCw
} from 'lucide-react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const BACKEND_URL = 'http://localhost:5000'; 

export default function SettingsPage() {
  const [connected, setConnected] = useState({ meta: false, instagram: true });
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false); // NEW
  
  // Sync Status State
  const [syncStatus, setSyncStatus] = useState<{ isSyncing: boolean; etaMinutes: number; pageCount: number } | null>(null);
  
  // Data State
  const [activeProfiles, setActiveProfiles] = useState<any[]>([]); // NEW
  const [availablePages, setAvailablePages] = useState<any[]>([]);
  const [selectedPages, setSelectedPages] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_META_APP_ID, 
          cookie: true,
          xfbml: true,
          version: 'v18.0' 
        });
        setIsSdkLoaded(true);
      };

      (function(d, s, id) {
         let js: any, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "https://connect.facebook.net/en_US/sdk.js";
         fjs?.parentNode?.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    }
  }, []);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/analytics/profiles/list`);
        if (res.ok) {
          const profiles = await res.json();
          setActiveProfiles(profiles); // Store to use for manual sync
          const hasMeta = profiles.some((p: any) => p.platform === 'facebook');
          setConnected(prev => ({ ...prev, meta: hasMeta }));
        }
      } catch (err) {}
    };
    checkConnectionStatus();
  }, []);

  const handleConnect = () => {
    if (!isSdkLoaded) return;
    setIsLoading(true);

    window.FB.login((response: any) => {
      if (response.authResponse) {
        const { accessToken: shortLivedToken } = response.authResponse;
        
        fetch(`${BACKEND_URL}/api/auth/meta/fetch-pages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shortLivedToken })
        })
        .then(res => res.json())
        .then(data => {
          if (data.pages) {
            setAvailablePages(data.pages);
            setSelectedPages(data.pages); 
            setShowModal(true); 
          }
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }, {
      scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_engagement,pages_manage_metadata,read_insights,instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,business_management'
    });
  };

  const handleConfirmSelection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/meta/confirm-pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedPages })
      });
      
      if (response.ok) {
        const totalEstimatedSeconds = selectedPages.length * 3 * 6;
        const etaMinutes = Math.max(1, Math.ceil(totalEstimatedSeconds / 60)); 
        
        setSyncStatus({ isSyncing: true, etaMinutes, pageCount: selectedPages.length });
        setAvailablePages([]);
        setSelectedPages([]);
        setShowModal(false);
        setConnected({ ...connected, meta: true });
      }
    } catch (error) {}
    setIsLoading(false);
  };

  // --- NEW: Manual Sync Trigger ---
  const handleManualSync = async () => {
    setIsManualSyncing(true);
    try {
      for (const profile of activeProfiles) {
         await fetch(`${BACKEND_URL}/api/analytics/profiles/${profile.profileId}/sync`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ days: 30 }) // Fetch last 30 days to catch up on any gaps
         });
      }
      const etaMinutes = Math.max(1, Math.ceil((activeProfiles.length * 3 * 2) / 60));
      setSyncStatus({ isSyncing: true, etaMinutes, pageCount: activeProfiles.length });
    } catch (e) {}
    setIsManualSyncing(false);
  };

  const toggleSelection = (page: any) => {
    setSelectedPages(prev => {
      const exists = prev.find(p => p.id === page.id);
      return exists ? prev.filter(p => p.id !== page.id) : [...prev, page];
    });
  };

  const handleSelectAll = () => {
    if (selectedPages.length === availablePages.length) setSelectedPages([]);
    else setSelectedPages([...availablePages]);
  };

  const filteredPages = availablePages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your connected social accounts and workspace preferences.</p>
      </div>

      {syncStatus?.isSyncing && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="mt-0.5 rounded-full bg-blue-100 p-2 text-blue-600">
            <Clock size={20} className="animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-blue-900">Data Sync in Progress</h3>
            <p className="text-sm text-blue-700 mt-1">
              We are currently downloading historical data for {syncStatus.pageCount} page(s). 
              This happens in the background to respect platform rate limits.
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mt-3">
              Estimated wait time: ~{syncStatus.etaMinutes} Minute(s)
            </p>
          </div>
          <button onClick={() => setSyncStatus(null)} className="text-blue-400 hover:text-blue-600">
            <X size={18} />
          </button>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-base font-bold text-gray-900">Connected Accounts</h2>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="flex flex-col divide-y divide-gray-50">

            {/* Meta Connection Block */}
            <div className={`p-6 transition-colors ${connected.meta ? 'bg-blue-50/30' : 'bg-white'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md shrink-0">
                    <Facebook size={24} fill="currentColor" className="text-white" />
                  </div>
                  <div className="w-full max-w-lg">
                    <h3 className="text-sm font-bold text-gray-900">Facebook Pages & Groups</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Publish posts, track engagement, and manage messages.</p>
                    
                    {connected.meta ? (
                      <span className="mt-2 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-green-600">
                        <CheckCircle2 size={14} /> Tracking {activeProfiles.filter(p => p.platform === 'facebook').length} Page(s)
                      </span>
                    ) : (
                      <span className="mt-2 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-500">
                        <AlertCircle size={14} /> Not Connected
                      </span>
                    )}
                  </div>
                </div>

                {!connected.meta ? (
                  <button 
                    onClick={handleConnect}
                    disabled={!isSdkLoaded || isLoading}
                    className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#1877F2] px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(24,119,242,0.39)] transition-all hover:bg-[#166fe5] hover:shadow-[0_6px_20px_rgba(24,119,242,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Facebook size={18} fill="currentColor" />}
                    <span>{isLoading ? "Loading..." : "Connect to Meta"}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleManualSync}
                      disabled={isManualSyncing || syncStatus?.isSyncing}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw size={14} className={isManualSyncing || syncStatus?.isSyncing ? "animate-spin text-blue-600" : ""} />
                      {isManualSyncing || syncStatus?.isSyncing ? "Syncing..." : "Sync Now"}
                    </button>
                    <button disabled className="rounded-xl border border-green-200 bg-green-50 px-5 py-2 text-sm font-bold text-green-700 cursor-default flex items-center gap-2">
                      <CheckCircle2 size={16} /> Connected
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Instagram Block */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white shadow-sm">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Instagram Professional</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Requires a connected Facebook Page.</p>
                  </div>
                </div>
                <button className="rounded-full bg-gray-900 px-5 py-2 text-sm font-bold text-white hover:bg-gray-800 transition-colors">
                  Connect
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- PAGE SELECTION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-bold text-xl text-gray-900">Import Meta Pages</h3>
                <p className="text-sm text-gray-500 mt-1">Select the pages you want to track in your workspace.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-3 border-b border-gray-100 bg-white sticky top-0 z-10 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                <Search size={16} className="text-gray-400" />
                <input 
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages..." className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              <button onClick={handleSelectAll} className="flex items-center gap-2 w-full px-2 py-1 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                {selectedPages.length === availablePages.length ? <CheckSquare size={16} className="text-blue-600"/> : <Square size={16} />}
                {selectedPages.length === availablePages.length ? "Deselect All Pages" : "Select All Pages"}
              </button>
            </div>

            <div className="overflow-y-auto p-3 space-y-1 flex-1 custom-scrollbar bg-gray-50/30">
              {filteredPages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No pages found.</div>
              ) : (
                filteredPages.map(page => {
                  const isSelected = selectedPages.some(p => p.id === page.id);
                  return (
                    <button key={page.id} onClick={() => toggleSelection(page)} className={`flex items-center gap-4 w-full text-left px-4 py-3 text-sm transition-all rounded-xl border ${isSelected ? 'bg-blue-50/50 border-blue-200 text-gray-900 shadow-sm' : 'bg-white border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}>
                      {isSelected ? <CheckSquare size={18} className="text-blue-600 flex-shrink-0"/> : <Square size={18} className="text-gray-300 flex-shrink-0"/>}
                      <span className={`truncate flex-1 ${isSelected ? 'font-bold' : 'font-medium'}`}>{page.name}</span>
                    </button>
                  );
                })
              )}
            </div>
            
            <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
              <span className="text-sm font-semibold text-gray-500">{selectedPages.length} selected</span>
              <button onClick={handleConfirmSelection} disabled={selectedPages.length === 0 || isLoading} className="flex items-center gap-2 rounded-xl bg-[#1877F2] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#166fe5] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Import Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}