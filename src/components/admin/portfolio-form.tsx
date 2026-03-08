"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "./image-uploader";
import { uploadImage } from "@/lib/supabase/storage";
import { createPortfolioItem, updatePortfolioItem } from "@/lib/actions/portfolio";
import { PortfolioItem } from "@/types/database";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  display_order: z.number().int().min(0),
});

type FormValues = z.infer<typeof schema>;

interface PortfolioFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: PortfolioItem | null;
}

export function PortfolioForm({ open, onOpenChange, editItem }: PortfolioFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: editItem?.title || "",
      description: editItem?.description || "",
      category: editItem?.category || "bridal",
      is_featured: editItem?.is_featured || false,
      is_published: editItem?.is_published || false,
      display_order: editItem?.display_order || 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      let coverUrl = editItem?.cover_image_url || undefined;

      if (coverFile) {
        const path = `portfolio/${Date.now()}/cover.${coverFile.name.split(".").pop()}`;
        coverUrl = await uploadImage(coverFile, path);
      }

      if (editItem) {
        await updatePortfolioItem(editItem.id, { ...values, cover_image_url: coverUrl });
        toast.success("Portfolio item updated");
      } else {
        await createPortfolioItem({ ...values, cover_image_url: coverUrl });
        toast.success("Portfolio item created");
      }
      onOpenChange(false);
      form.reset();
      setCoverFile(null);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit" : "Add"} Portfolio Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(v) => v && form.setValue("category", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bridal">Bridal</SelectItem>
                <SelectItem value="editorial">Editorial</SelectItem>
                <SelectItem value="occasions">Occasions</SelectItem>
                <SelectItem value="special-fx">Special FX</SelectItem>
                <SelectItem value="everyday">Everyday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} rows={3} />
          </div>
          <ImageUploader
            currentImageUrl={editItem?.cover_image_url || undefined}
            onFileSelect={setCoverFile}
            label="Cover Image"
          />
          <div>
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              {...form.register("display_order", { valueAsNumber: true })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="is_featured">Featured</Label>
            <Switch
              id="is_featured"
              checked={form.watch("is_featured")}
              onCheckedChange={(v) => form.setValue("is_featured", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="is_published">Published</Label>
            <Switch
              id="is_published"
              checked={form.watch("is_published")}
              onCheckedChange={(v) => form.setValue("is_published", v)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editItem ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
