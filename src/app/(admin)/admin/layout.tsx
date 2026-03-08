import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Mock mode: skip auth check
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="hidden w-64 shrink-0 lg:block">
        <Sidebar />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
