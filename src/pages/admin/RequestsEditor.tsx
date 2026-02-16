import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trash2, Eye, Inbox } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ContactRequest {
  id: string;
  name: string;
  contact_id: string;
  project_details: string;
  project_links: string | null;
  plan_name: string;
  created_at: string;
}

export default function RequestsEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewItem, setViewItem] = useState<ContactRequest | null>(null);

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
      toast({ title: "Deleted", description: "Request removed." });
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contact Requests</h1>
        <p className="text-sm text-muted-foreground">View and manage incoming project requests.</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
          <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No requests yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.contact_id}</TableCell>
                  <TableCell>{r.plan_name}</TableCell>
                  <TableCell>{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => setViewItem(r)}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request from {viewItem?.name}</DialogTitle>
            <DialogDescription>Submitted on {viewItem ? format(new Date(viewItem.created_at), "PPP 'at' p") : ""}</DialogDescription>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-muted-foreground">Plan:</span> <span className="text-foreground">{viewItem.plan_name}</span></div>
              <div><span className="font-medium text-muted-foreground">Contact:</span> <span className="text-foreground">{viewItem.contact_id}</span></div>
              <div><span className="font-medium text-muted-foreground">Project Details:</span><p className="mt-1 whitespace-pre-wrap text-foreground">{viewItem.project_details}</p></div>
              {viewItem.project_links && <div><span className="font-medium text-muted-foreground">Links:</span> <span className="text-foreground">{viewItem.project_links}</span></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
