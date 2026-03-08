import { getAllSettings } from "@/lib/queries/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
