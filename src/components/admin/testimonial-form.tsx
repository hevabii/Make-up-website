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
import { createTestimonial, updateTestimonial } from "@/lib/actions/testimonials";
import { Testimonial } from "@/types/database";

const schema = z.object({
  client_name: z.string().min(1, "Client name is required"),
  content: z.string().min(1, "Content is required"),
  service_type: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface TestimonialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: Testimonial | null;
}

export function TestimonialForm({ open, onOpenChange, editItem }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      client_name: editItem?.client_name || "",
      content: editItem?.content || "",
      service_type: editItem?.service_type || "",
      rating: editItem?.rating || 5,
      is_featured: editItem?.is_featured || false,
      is_published: editItem?.is_published ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (editItem) {
        await updateTestimonial(editItem.id, values);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial({ ...values, service_type: values.service_type ?? undefined, rating: values.rating ?? undefined });
        toast.success("Testimonial created");
      }
      onOpenChange(false);
      form.reset();
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
          <DialogTitle>{editItem ? "Edit" : "Add"} Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="client_name">Client Name</Label>
            <Input id="client_name" {...form.register("client_name")} />
            {form.formState.errors.client_name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.client_name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="content">Testimonial</Label>
            <Textarea id="content" {...form.register("content")} rows={4} />
            {form.formState.errors.content && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.content.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_type">Service Type</Label>
              <Input id="service_type" placeholder="e.g. Bridal" {...form.register("service_type")} />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Select
                value={String(form.watch("rating") || 5)}
                onValueChange={(v) => v && form.setValue("rating", parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={String(r)}>
                      {r} Star{r !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
