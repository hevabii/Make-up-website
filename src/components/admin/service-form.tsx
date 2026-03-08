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
import { createService, updateService } from "@/lib/actions/services";
import { Service } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0).optional().nullable(),
  price_note: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem?: Service | null;
}

export function ServiceForm({ open, onOpenChange, editItem }: ServiceFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: editItem?.name || "",
      description: editItem?.description || "",
      price: editItem?.price || null,
      price_note: editItem?.price_note || "",
      duration: editItem?.duration || "",
      category: editItem?.category || "general",
      display_order: editItem?.display_order || 0,
      is_active: editItem?.is_active ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (editItem) {
        await updateService(editItem.id, values);
        toast.success("Service updated");
      } else {
        await createService({ ...values, price: values.price ?? undefined, price_note: values.price_note ?? undefined, duration: values.duration ?? undefined });
        toast.success("Service created");
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
          <DialogTitle>{editItem ? "Edit" : "Add"} Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register("price", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="price_note">Price Note</Label>
              <Input id="price_note" placeholder="e.g. starting at" {...form.register("price_note")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" placeholder="e.g. 1-2 hours" {...form.register("duration")} />
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
                  <SelectItem value="lessons">Lessons</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              {...form.register("display_order", { valueAsNumber: true })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Active</Label>
            <Switch
              id="is_active"
              checked={form.watch("is_active")}
              onCheckedChange={(v) => form.setValue("is_active", v)}
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
