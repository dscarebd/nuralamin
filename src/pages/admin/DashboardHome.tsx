import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FolderOpen, Briefcase, DollarSign, Link2, Eye, Users, FileText, MessageCircle,
  TrendingUp, Globe, Clock, BarChart3, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { useMemo } from "react";

export default function DashboardHome() {
  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: async () => { const { data } = await supabase.from("projects").select("id"); return data ?? []; }});
  const { data: experiences } = useQuery({ queryKey: ["experiences"], queryFn: async () => { const { data } = await supabase.from("experiences").select("id"); return data ?? []; }});
  const { data: plans } = useQuery({ queryKey: ["pricing_plans"], queryFn: async () => { const { data } = await supabase.from("pricing_plans").select("id"); return data ?? []; }});
  const { data: socials } = useQuery({ queryKey: ["social_links"], queryFn: async () => { const { data } = await supabase.from("social_links").select("id"); return data ?? []; }});
  const { data: blogPosts } = useQuery({ queryKey: ["admin_blog_posts"], queryFn: async () => { const { data } = await supabase.from("blog_posts").select("id, is_published, title, created_at"); return data ?? []; }});
  const { data: contactRequests } = useQuery({ queryKey: ["admin_contact_requests"], queryFn: async () => { const { data } = await supabase.from("contact_requests").select("*").order("created_at", { ascending: false }); return data ?? []; }});

  // Page views data
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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const prev7Days = new Date(last7Days.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayViews = pageViews.filter(v => new Date(v.created_at) >= today);
    const week = pageViews.filter(v => new Date(v.created_at) >= last7Days);
    const prevWeek = pageViews.filter(v => { const d = new Date(v.created_at); return d >= prev7Days && d < last7Days; });
    const month = pageViews.filter(v => new Date(v.created_at) >= last30Days);

    const uniqueToday = new Set(todayViews.map(v => v.visitor_id)).size;
    const uniqueWeek = new Set(week.map(v => v.visitor_id)).size;
    const uniqueMonth = new Set(month.map(v => v.visitor_id)).size;
    const totalUnique = new Set(pageViews.map(v => v.visitor_id)).size;

    const weekChange = prevWeek.length > 0 ? Math.round(((week.length - prevWeek.length) / prevWeek.length) * 100) : 100;

    // Top pages
    const pageCounts: Record<string, number> = {};
    week.forEach(v => { pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1; });
    const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Daily views for last 7 days
    const dailyViews: { day: string; views: number; visitors: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const next = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      const dayViews = pageViews.filter(v => { const vd = new Date(v.created_at); return vd >= d && vd < next; });
      dailyViews.push({
        day: d.toLocaleDateString("en", { weekday: "short" }),
        views: dayViews.length,
        visitors: new Set(dayViews.map(v => v.visitor_id)).size,
      });
    }

    return {
      todayViews: todayViews.length, uniqueToday,
      weekViews: week.length, uniqueWeek, weekChange,
      monthViews: month.length, uniqueMonth,
      totalViews: pageViews.length, totalUnique,
      topPages, dailyViews,
    };
  }, [pageViews]);

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

  const trafficStats = analytics ? [
    { label: "Today's Views", count: analytics.todayViews, sub: `${analytics.uniqueToday} unique`, icon: Eye, color: "text-sky-500" },
    { label: "This Week", count: analytics.weekViews, sub: `${analytics.uniqueWeek} unique`, icon: TrendingUp, color: "text-emerald-500", change: analytics.weekChange },
    { label: "This Month", count: analytics.monthViews, sub: `${analytics.uniqueMonth} unique`, icon: BarChart3, color: "text-amber-500" },
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
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Globe className="h-4 w-4" /> Visitor Analytics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Weekly Chart + Top Pages */}
      {analytics && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Simple bar chart */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Last 7 Days</h3>
            <div className="flex items-end gap-2" style={{ height: 120 }}>
              {analytics.dailyViews.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-muted-foreground">{d.views}</span>
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                    style={{ height: `${(d.views / maxDailyViews) * 80}px`, minHeight: d.views > 0 ? 4 : 0 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top pages */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Top Pages (This Week)</h3>
            {analytics.topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No page views yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topPages.map(([path, count]) => {
                  const pct = analytics.weekViews > 0 ? (count / analytics.weekViews) * 100 : 0;
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
              {/* Recent contact requests */}
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
              {/* Recent blog posts */}
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
