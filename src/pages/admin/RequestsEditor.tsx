import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Eye, Inbox, CheckCheck, ClipboardList, MessageCircle, FileText, Link2, DollarSign, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Status = "pending" | "approved" | "rejected" | "working" | "delivered";

interface ContactRequest {
  id: string;
  name: string;
  contact_id: string;
  project_details: string;
  project_links: string | null;
  plan_name: string;
  budget: string | null;
  created_at: string;
  is_read: boolean;
  status: Status;
}

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  approved: { label: "Approved", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  rejected: { label: "Rejected", className: "bg-red-500/15 text-red-600 border-red-500/30" },
  working: { label: "Working", className: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  delivered: { label: "Delivered", className: "bg-violet-500/15 text-violet-600 border-violet-500/30" },
};

function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export default function RequestsEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewItem, setViewItem] = useState<ContactRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["contact_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactRequest[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_requests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_requests"] });
      queryClient.invalidateQueries({ queryKey: ["unread_requests_count"] });
      toast({ title: "Deleted", description: "Request removed." });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_requests").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_requests"] });
      queryClient.invalidateQueries({ queryKey: ["unread_requests_count"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contact_requests").update({ is_read: true }).eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_requests"] });
      queryClient.invalidateQueries({ queryKey: ["unread_requests_count"] });
      toast({ title: "Done", description: "All requests marked as read." });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("contact_requests").update({ status } as any).eq("id", id);
      if (error) throw error;

      // Send Telegram notification for approved/delivered
      if (status === "approved" || status === "delivered") {
        const request = requests.find((r) => r.id === id);
        if (request) {
          supabase.functions.invoke("notify-telegram", {
            body: {
              type: "status_change",
              status,
              name: request.name,
              plan_name: request.plan_name,
              contact_id: request.contact_id,
            },
          }).catch(console.error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_requests"] });
      toast({ title: "Updated", description: "Status changed." });
    },
  });

  const handleView = (r: ContactRequest) => {
    setViewItem(r);
    if (!r.is_read) {
      markReadMutation.mutate(r.id);
    }
  };

  const unreadCount = requests.filter((r) => !r.is_read).length;
  const filtered = statusFilter === "all" ? requests : requests.filter((r) => r.status === statusFilter);

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Requests</h1>
          <p className="text-sm text-muted-foreground">View and manage incoming project requests.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={() => markAllReadMutation.mutate()}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
          {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
            <TabsTrigger key={s} value={s}>
              {STATUS_CONFIG[s].label} ({requests.filter((r) => r.status === s).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
          <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No requests found.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className={!r.is_read ? "bg-primary/5" : ""}>
                  <TableCell>
                    {!r.is_read && <span className="block h-2.5 w-2.5 rounded-full bg-primary" />}
                  </TableCell>
                  <TableCell className={`font-medium ${!r.is_read ? "font-bold" : ""}`}>{r.name}</TableCell>
                  <TableCell>{r.contact_id}</TableCell>
                  <TableCell>{r.plan_name}</TableCell>
                  <TableCell>
                    <Select
                      value={r.status}
                      onValueChange={(v) => updateStatusMutation.mutate({ id: r.id, status: v as Status })}
                    >
                      <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => handleView(r)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteMutation.mutate(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl">
          {viewItem && (
            <>
              <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent px-6 pt-6 pb-4">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">{viewItem.name}</DialogTitle>
                  <DialogDescription className="text-xs">{format(new Date(viewItem.created_at), "PPP 'at' p")}</DialogDescription>
                </DialogHeader>
                <div className="mt-2"><StatusBadge status={viewItem.status} /></div>
              </div>
              <div className="grid gap-3 px-6 pb-6 pt-2">
                <div className="rounded-xl border bg-muted/30 p-4 flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15"><ClipboardList className="h-5 w-5 text-amber-500" /></div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Plan</p>
                    <p className="text-sm font-semibold text-foreground">{viewItem.plan_name}</p>
                  </div>
                </div>
                <div className="rounded-xl border bg-muted/30 p-4 flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15"><MessageCircle className="h-5 w-5 text-emerald-500" /></div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Contact</p>
                    <p className="text-sm font-semibold text-foreground">{viewItem.contact_id}</p>
                  </div>
                </div>
                <div className="rounded-xl border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15"><FileText className="h-5 w-5 text-violet-500" /></div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Project Details</p>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed pl-12">{viewItem.project_details}</p>
                </div>
                {viewItem.budget && (
                  <div className="rounded-xl border bg-muted/30 p-4 flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15"><DollarSign className="h-5 w-5 text-rose-500" /></div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Budget</p>
                      <p className="text-sm font-semibold text-foreground">{viewItem.budget}</p>
                    </div>
                  </div>
                )}
                {viewItem.project_links && (
                  <div className="rounded-xl border bg-muted/30 p-4 flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15"><Link2 className="h-5 w-5 text-sky-500" /></div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Links</p>
                      <p className="text-sm font-semibold text-foreground truncate">{viewItem.project_links}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
