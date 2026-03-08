"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateInquiryStatus, deleteInquiry } from "@/lib/actions/inquiries";
import { Inquiry } from "@/types/database";

const statusColors: Record<string, string> = {
  new: "default",
  read: "secondary",
  replied: "outline",
  archived: "outline",
};

export function InquiriesManager({ initialItems }: { initialItems: Inquiry[] }) {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInquiryStatus(id, status);
      toast.success("Status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInquiry(deleteId);
      toast.success("Inquiry deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No inquiries yet.
                </TableCell>
              </TableRow>
            ) : (
              initialItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={`cursor-pointer ${item.status === "new" ? "font-semibold" : ""}`}
                  onClick={() => setSelectedInquiry(item)}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.service_interest || "\u2014"}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[item.status] as "default" | "secondary" | "outline"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry from {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Email</p>
                  <p>{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Phone</p>
                  <p>{selectedInquiry.phone || "\u2014"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Service Interest</p>
                  <p>{selectedInquiry.service_interest || "\u2014"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Preferred Date</p>
                  <p>{selectedInquiry.preferred_date || "\u2014"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Preferred Time</p>
                  <p>{selectedInquiry.preferred_time || "\u2014"}</p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-500 text-sm mb-1">Message</p>
                <p className="text-sm bg-gray-50 rounded-lg p-3">{selectedInquiry.message}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-gray-500">Status:</p>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(v) => v && handleStatusChange(selectedInquiry!.id, v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete inquiry?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
