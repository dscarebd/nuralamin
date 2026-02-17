import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FolderOpen, Briefcase, DollarSign, Link2, Eye, Users, FileText, MessageCircle,
  TrendingUp, Globe, Clock, BarChart3, ArrowUpRight, ArrowDownRight, CalendarIcon, Filter,
} from "lucide-react";
import { useMemo, useState } from "react";
import { format, subDays, startOfDay, endOfDay, differenceInDays, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type DateRange = { from: Date; to: Date };
type PresetKey = "today" | "7d" | "30d" | "90d" | "all" | "custom";

const presets: { key: PresetKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "all", label: "All Time" },
  { key: "custom", label: "Custom" },
];

function getPresetRange(key: PresetKey): DateRange | null {
  const now = new Date();
  const today = startOfDay(now);
  switch (key) {
    case "today": return { from: today, to: endOfDay(now) };
    case "7d": return { from: subDays(today, 6), to: endOfDay(now) };
    case "30d": return { from: subDays(today, 29), to: endOfDay(now) };
    case "90d": return { from: subDays(today, 89), to: endOfDay(now) };
    case "all": return null;
    default: return null;
  }
}

export default function DashboardHome() {
  const [activePreset, setActivePreset] = useState<PresetKey>("7d");
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dateRange = useMemo<DateRange | null>(() => {
    if (activePreset === "custom" && customRange.from && customRange.to) {
      return { from: startOfDay(customRange.from), to: endOfDay(customRange.to) };
    }
    if (activePreset === "custom") return null;
    return getPresetRange(activePreset);
  }, [activePreset, customRange]);

  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: async () => { const { data } = await supabase.from("projects").select("id"); return data ?? []; }});
  const { data: experiences } = useQuery({ queryKey: ["experiences"], queryFn: async () => { const { data } = await supabase.from("experiences").select("id"); return data ?? []; }});
  const { data: plans } = useQuery({ queryKey: ["pricing_plans"], queryFn: async () => { const { data } = await supabase.from("pricing_plans").select("id"); return data ?? []; }});
  const { data: socials } = useQuery({ queryKey: ["social_links"], queryFn: async () => { const { data } = await supabase.from("social_links").select("id"); return data ?? []; }});
  const { data: blogPosts } = useQuery({ queryKey: ["admin_blog_posts"], queryFn: async () => { const { data } = await supabase.from("blog_posts").select("id, is_published, title, created_at"); return data ?? []; }});
  const { data: contactRequests } = useQuery({ queryKey: ["admin_contact_requests"], queryFn: async () => { const { data } = await supabase.from("contact_requests").select("*").order("created_at", { ascending: false }); return data ?? []; }});

  const { data: pageViews } = useQuery({
    queryKey: ["admin_page_views"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_views")
        .select("page_path, visitor_id, created_at")
        .order("created_at", { ascending: false })
        .limit(1000);
      return data ?? [];
    },
  });

  const analytics = useMemo(() => {
    if (!pageViews) return null;

    const now = new Date();
    const today = startOfDay(now);

    // Filtered views based on selected range
    const filtered = dateRange
      ? pageViews.filter(v => { const d = new Date(v.created_at); return d >= dateRange.from && d <= dateRange.to; })
      : pageViews;

    // Previous period for comparison
    const rangeDays = dateRange ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0;
    const prevFiltered = dateRange
      ? pageViews.filter(v => { const d = new Date(v.created_at); const prevStart = subDays(dateRange.from, rangeDays); return d >= prevStart && d < dateRange.from; })
      : [];

    const uniqueFiltered = new Set(filtered.map(v => v.visitor_id)).size;
    const change = prevFiltered.length > 0 ? Math.round(((filtered.length - prevFiltered.length) / prevFiltered.length) * 100) : (filtered.length > 0 ? 100 : 0);

    // Today stats (always show)
    const todayViews = pageViews.filter(v => new Date(v.created_at) >= today);
    const uniqueToday = new Set(todayViews.map(v => v.visitor_id)).size;
    const totalUnique = new Set(pageViews.map(v => v.visitor_id)).size;

    // Top pages for selected range
    const pageCounts: Record<string, number> = {};
    filtered.forEach(v => { pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1; });
    const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Daily views for chart - show days in selected range (max 30 bars)
    const chartDays = dateRange ? Math.min(rangeDays, 30) : 7;
    const chartEnd = dateRange ? dateRange.to : endOfDay(now);
    const dailyViews: { day: string; views: number; visitors: number }[] = [];
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = startOfDay(subDays(chartEnd, i));
      const next = endOfDay(d);
      const dayViews = pageViews.filter(v => { const vd = new Date(v.created_at); return vd >= d && vd <= next; });
      dailyViews.push({
        day: format(d, chartDays > 14 ? "d MMM" : "EEE"),
        views: dayViews.length,
        visitors: new Set(dayViews.map(v => v.visitor_id)).size,
      });
    }

    return {
      todayViews: todayViews.length, uniqueToday,
      filteredViews: filtered.length, uniqueFiltered, change,
      totalViews: pageViews.length, totalUnique,
      topPages, dailyViews,
    };
  }, [pageViews, dateRange]);

  const unreadRequests = contactRequests?.filter(r => !r.is_read).length ?? 0;
  const publishedPosts = blogPosts?.filter(p => p.is_published).length ?? 0;

  const contentStats = [
    { label: "Projects", count: projects?.length ?? 0, icon: FolderOpen, color: "text-primary" },
    { label: "Experiences", count: experiences?.length ?? 0, icon: Briefcase, color: "text-emerald-500" },
    { label: "Pricing Plans", count: plans?.length ?? 0, icon: DollarSign, color: "text-amber-500" },
    { label: "Social Links", count: socials?.length ?? 0, icon: Link2, color: "text-purple-500" },
    { label: "Blog Posts", count: publishedPosts, icon: FileText, color: "text-sky-500" },
    { label: "Requests", count: contactRequests?.length ?? 0, icon: MessageCircle, color: "text-rose-500", badge: unreadRequests > 0 ? `${unreadRequests} new` : undefined },
  ];

  const rangeLabel = activePreset === "custom" && customRange.from && customRange.to
    ? `${format(customRange.from, "MMM d")} – ${format(customRange.to, "MMM d, yyyy")}`
    : presets.find(p => p.key === activePreset)?.label ?? "";

  const trafficStats = analytics ? [
    { label: "Today's Views", count: analytics.todayViews, sub: `${analytics.uniqueToday} unique`, icon: Eye, color: "text-sky-500" },
    { label: rangeLabel + " Views", count: analytics.filteredViews, sub: `${analytics.uniqueFiltered} unique`, icon: TrendingUp, color: "text-emerald-500", change: analytics.change },
    { label: "Total Visitors", count: analytics.totalUnique, sub: `${analytics.totalViews} views`, icon: Users, color: "text-primary" },
  ] : [];

  const maxDailyViews = analytics ? Math.max(...analytics.dailyViews.map(d => d.views), 1) : 1;

  const pageNameMap: Record<string, string> = {
    "/": "Home",
    "/portfolio": "Portfolio",
    "/blog": "Blog",
    "/pricing": "Pricing",
    "/privacy-policy": "Privacy Policy",
    "/terms-of-service": "Terms of Service",
    "/refund-policy": "Refund Policy",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Traffic Stats */}
      {analytics && (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Globe className="h-4 w-4" /> Visitor Analytics
            </h2>
            {/* Date Range Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              {presets.filter(p => p.key !== "custom").map((p) => (
                <Button
                  key={p.key}
                  variant={activePreset === p.key ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => { setActivePreset(p.key); setCustomRange({}); }}
                >
                  {p.label}
                </Button>
              ))}
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={activePreset === "custom" ? "default" : "outline"}
                    size="sm"
                    className="h-7 gap-1 px-2.5 text-xs"
                  >
                    <CalendarIcon className="h-3 w-3" />
                    {activePreset === "custom" && customRange.from && customRange.to
                      ? `${format(customRange.from, "MMM d")} – ${format(customRange.to, "MMM d")}`
                      : "Custom"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={customRange.from ? { from: customRange.from, to: customRange.to } : undefined}
                    onSelect={(range) => {
                      setCustomRange({ from: range?.from, to: range?.to });
                      if (range?.from && range?.to) {
                        setActivePreset("custom");
                        setCalendarOpen(false);
                      }
                    }}
                    disabled={(date) => date > new Date()}
                    numberOfMonths={2}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trafficStats.map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <s.icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{s.count.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                  {s.change !== undefined && (
                    <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                      {s.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(s.change)}%
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart + Top Pages */}
      {analytics && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {rangeLabel} — Daily Views
            </h3>
            <div className="flex items-end gap-1" style={{ height: 120 }}>
              {analytics.dailyViews.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1 min-w-0">
                  <span className="text-[10px] font-medium text-muted-foreground">{d.views}</span>
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                    style={{ height: `${(d.views / maxDailyViews) * 80}px`, minHeight: d.views > 0 ? 4 : 0 }}
                  />
                  <span className="text-[9px] text-muted-foreground truncate w-full text-center">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Top Pages ({rangeLabel})</h3>
            {analytics.topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No page views in this period</p>
            ) : (
              <div className="space-y-3">
                {analytics.topPages.map(([path, count]) => {
                  const pct = analytics.filteredViews > 0 ? (count / analytics.filteredViews) * 100 : 0;
                  return (
                    <div key={path} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{pageNameMap[path] || path}</span>
                        <span className="text-muted-foreground">{count} views</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Stats */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <BarChart3 className="h-4 w-4" /> Content Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contentStats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">{s.count}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
                {s.badge && (
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-500">{s.badge}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Clock className="h-4 w-4" /> Recent Activity
        </h2>
        <div className="rounded-xl border bg-card">
          {(!contactRequests || contactRequests.length === 0) && (!blogPosts || blogPosts.length === 0) ? (
            <p className="p-5 text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="divide-y divide-border">
              {(contactRequests ?? []).slice(0, 5).map((req) => (
                <div key={req.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${req.is_read ? "bg-muted" : "bg-rose-500/10"}`}>
                    <MessageCircle className={`h-4 w-4 ${req.is_read ? "text-muted-foreground" : "text-rose-500"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {req.name} — {req.plan_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{req.project_details}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatTimeAgo(req.created_at)}
                  </span>
                </div>
              ))}
              {(blogPosts ?? []).slice(0, 3).map((post) => (
                <div key={post.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10">
                    <FileText className="h-4 w-4 text-sky-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.is_published ? "Published" : "Draft"}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatTimeAgo(post.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en", { month: "short", day: "numeric" });
}
