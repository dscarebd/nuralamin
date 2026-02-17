import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Loader2, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  className?: string;
}

export default function MultiImageUpload({ value, onChange, folder = "images", className }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("uploads").upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(fileName);
      onChange([...value, publicUrl]);
      toast({ title: "Image uploaded!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    onChange([...value, url]);
    setUrlInput("");
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      {value.length > 0 && (
        <div className="mb-2 grid grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} alt={`Gallery ${i + 1}`} className="h-20 w-full rounded-lg border object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          placeholder="Paste image URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={addUrl} disabled={!urlInput.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </Button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  );
}
