"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BlockedSlot } from "@/types/database";
import { createBlockedSlotRange, deleteBlockedSlot } from "@/lib/actions/availability";

const HOUR_OPTIONS = Array.from({ length: 14 }, (_, i) => i + 8);
const TIMEZONE_LABEL = "Philippine Time (PHT, UTC+8)";

function formatHour(hour: number) {
  const date = new Date(2000, 0, 1, hour, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AvailabilityManager({ initialItems }: { initialItems: BlockedSlot[] }) {
  const router = useRouter();
  const [slotDate, setSlotDate] = useState("");
  const [startHour, setStartHour] = useState("12");
  const [endHour, setEndHour] = useState("15");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);

  const sortedItems = useMemo(
    () => [...initialItems].sort((a, b) => {
      const byDate = a.slot_date.localeCompare(b.slot_date);
      if (byDate !== 0) return byDate;
      return a.slot_hour - b.slot_hour;
    }),
    [initialItems]
  );

  const selectedRange = useMemo(() => {
    const start = Math.min(Number(startHour), Number(endHour));
    const end = Math.max(Number(startHour), Number(endHour));
    return { start, end };
  }, [startHour, endHour]);

  const handleAddBlockedSlot = async () => {
    if (!slotDate) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      await createBlockedSlotRange({
        slot_date: slotDate,
        start_hour: selectedRange.start,
        end_hour: selectedRange.end,
        reason,
      });
      toast.success("Time range blocked");
      setReason("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to block slot");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBlockedSlot(deleteId);
      toast.success("Blocked slot removed");
      router.refresh();
    } catch {
      toast.error("Failed to remove blocked slot");
    }
    setDeleteId(null);
  };

  const handleDragStart = (hour: number) => {
    setIsDragging(true);
    setDragStart(hour);
    setDragEnd(hour);
  };

  const handleDragEnter = (hour: number) => {
    if (!isDragging) return;
    setDragEnd(hour);
  };

  const handleDragEnd = () => {
    if (dragStart === null || dragEnd === null) {
      setIsDragging(false);
      return;
    }
    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);
    setStartHour(String(start));
    setEndHour(String(end));
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseUp = () => handleDragEnd();
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [isDragging, dragStart, dragEnd]);

  const inDraggedRange = (hour: number) => {
    if (dragStart === null || dragEnd === null) return false;
    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);
    return hour >= start && hour <= end;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Availability</h1>

      <div className="rounded-lg border bg-white p-4 space-y-4">
        <p className="text-sm text-gray-600">
          Drag across hours to select a range (for example, 12 PM to 3 PM), then block it.
        </p>
        <p className="text-xs text-gray-500">
          Timezone: {TIMEZONE_LABEL}
        </p>

        <div className="space-y-2">
          <Label>Drag To Select Hours</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 select-none">
            {HOUR_OPTIONS.map((hour) => {
              const active = inDraggedRange(hour) || (hour >= selectedRange.start && hour <= selectedRange.end);
              return (
                <button
                  key={hour}
                  type="button"
                  onMouseDown={() => handleDragStart(hour)}
                  onMouseEnter={() => handleDragEnter(hour)}
                  onMouseUp={handleDragEnd}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
                >
                  {formatHour(hour)}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500">
            Selected range: {formatHour(selectedRange.start)} to {formatHour(selectedRange.end)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label htmlFor="slot-date">Date</Label>
            <Input
              id="slot-date"
              type="date"
              value={slotDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSlotDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Start Hour</Label>
            <Select value={startHour} onValueChange={(value) => value && setStartHour(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOUR_OPTIONS.map((hour) => (
                  <SelectItem key={hour} value={String(hour)}>
                    {formatHour(hour)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>End Hour</Label>
            <Select value={endHour} onValueChange={(value) => value && setEndHour(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOUR_OPTIONS.map((hour) => (
                  <SelectItem key={hour} value={String(hour)}>
                    {formatHour(hour)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="slot-reason">Reason (optional)</Label>
            <Input
              id="slot-reason"
              placeholder="Booked event, day off, travel..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleAddBlockedSlot} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          {loading ? "Blocking..." : "Block Selected Range"}
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Hour</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  No blocked slots yet.
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{slot.slot_date}</TableCell>
                  <TableCell>{formatHour(slot.slot_hour)}</TableCell>
                  <TableCell>{slot.reason || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => setDeleteId(slot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove blocked slot?</AlertDialogTitle>
            <AlertDialogDescription>
              This hour will become available again on the contact form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
