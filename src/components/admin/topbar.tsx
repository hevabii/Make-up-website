"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";
import { logout } from "@/lib/actions/auth";

export function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>
      <form action={logout}>
        <Button variant="ghost" size="icon" type="submit" title="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
