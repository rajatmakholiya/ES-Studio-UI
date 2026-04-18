import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface PageMetric {
  profileId: string;
  pageName: string;
  platform: string;
  followers: number;
  impressions: number;
  engagements: number;
  engagementRate: string;
  pageViews: number;
  videoViews: number;
  revenue: number;
}

type SortKey = keyof PageMetric;
type SortDir = "asc" | "desc";

const fetchPerPageData = async ({ queryKey }: any) => {
  const [_key, profileIds, startDate, endDate] = queryKey;
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const res = await fetch(`${BACKEND_URL}/api/analytics/aggregate/per-page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ profileIds, startDate, endDate }),
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || "Failed to fetch per-page metrics");
  return data as { pages: PageMetric[] };
};

export default function PageMetricsTable({
  selectedProfileIds,
  startDate,
  endDate,
  activePlatform,
}: {
  selectedProfileIds: string[];
  startDate: string;
  endDate: string;
  activePlatform: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data, isLoading } = useQuery({
    queryKey: ["per-page-aggregate", selectedProfileIds, startDate, endDate],
    queryFn: fetchPerPageData,
    enabled: selectedProfileIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const pages = data?.pages || [];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      // Handle string-typed numbers (engagementRate)
      if (sortKey === "engagementRate") {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      // Handle string comparison for pageName
      if (sortKey === "pageName") {
        aVal = (aVal as string).toLowerCase();
        bVal = (bVal as string).toLowerCase();
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      }

      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [pages, sortKey, sortDir]);

  const showRevenue = activePlatform === "facebook";

  const columns: { key: SortKey; label: string; align?: "left" | "right" }[] = [
    { key: "pageName", label: "Page Name", align: "left" },
    { key: "followers", label: "Followers", align: "right" },
    { key: "impressions", label: "Impressions", align: "right" },
    { key: "engagements", label: "Engagements", align: "right" },
    { key: "engagementRate", label: "Eng. Rate", align: "right" },
    { key: "pageViews", label: "Page Views", align: "right" },
    { key: "videoViews", label: "Video Views", align: "right" },
    ...(showRevenue
      ? [
          {
            key: "revenue" as SortKey,
            label: "Revenue",
            align: "right" as const,
          },
        ]
      : []),
  ];

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey)
      return <ArrowUpDown size={12} className="opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-indigo-500" />
    ) : (
      <ArrowDown size={12} className="text-indigo-500" />
    );
  };

  // --- Loading ----
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <Table2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Page-wise Breakdown
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Performance metrics for each selected page
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Empty ----
  if (pages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 text-center">
        <Table2 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          No page data available for the selected date range.
        </p>
      </div>
    );
  }

  // --- Totals row ---
  const totals = sortedPages.reduce(
    (acc, p) => {
      acc.followers += p.followers;
      acc.impressions += p.impressions;
      acc.engagements += p.engagements;
      acc.pageViews += p.pageViews;
      acc.videoViews += p.videoViews;
      acc.revenue += p.revenue;
      return acc;
    },
    {
      followers: 0,
      impressions: 0,
      engagements: 0,
      pageViews: 0,
      videoViews: 0,
      revenue: 0,
    },
  );

  const totalEngRate =
    totals.impressions > 0
      ? ((totals.engagements / totals.impressions) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <Table2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Page-wise Breakdown
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Performance metrics for each selected page
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`px-4 py-3 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    <SortIcon columnKey={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedPages.map((page) => (
              <tr
                key={page.profileId}
                className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
              >
                <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {page.pageName}
                </td>
                <td className="px-4 py-3.5 text-right font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                  {page.followers.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                  {page.impressions.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                  {page.engagements.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                    {page.engagementRate}%
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                  {page.pageViews.toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                  {page.videoViews.toLocaleString()}
                </td>
                {showRevenue && (
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${page.revenue.toFixed(2)}
                  </td>
                )}
              </tr>
            ))}

            {/* Totals row */}
            <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-t-2 border-gray-200 dark:border-gray-700">
              <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white uppercase text-xs tracking-wider">
                Total
              </td>
              <td className="px-4 py-3.5 text-right font-bold text-gray-900 dark:text-white tabular-nums">
                {totals.followers.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right font-bold text-gray-900 dark:text-white tabular-nums">
                {totals.impressions.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right font-bold text-gray-900 dark:text-white tabular-nums">
                {totals.engagements.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                  {totalEngRate}%
                </span>
              </td>
              <td className="px-4 py-3.5 text-right font-bold text-gray-900 dark:text-white tabular-nums">
                {totals.pageViews.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right font-bold text-gray-900 dark:text-white tabular-nums">
                {totals.videoViews.toLocaleString()}
              </td>
              {showRevenue && (
                <td className="px-4 py-3.5 text-right font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                  ${totals.revenue.toFixed(2)}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
