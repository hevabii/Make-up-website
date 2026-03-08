"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "./image-uploader";
import { uploadImage } from "@/lib/supabase/storage";
import { updateSettings } from "@/lib/actions/settings";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = { ...settings };

      if (heroImageFile) {
        const path = `settings/hero.${heroImageFile.name.split(".").pop()}`;
        updates.hero_image = await uploadImage(heroImageFile, path);
      }
      if (aboutImageFile) {
        const path = `settings/about.${aboutImageFile.name.split(".").pop()}`;
        updates.about_image = await uploadImage(aboutImageFile, path);
      }

      await updateSettings(updates);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4 pt-4">
          <div>
            <Label>Hero Title</Label>
            <Input value={settings.hero_title || ""} onChange={(e) => updateField("hero_title", e.target.value)} />
          </div>
          <div>
            <Label>Hero Subtitle</Label>
            <Input value={settings.hero_subtitle || ""} onChange={(e) => updateField("hero_subtitle", e.target.value)} />
          </div>
          <ImageUploader
            currentImageUrl={settings.hero_image || undefined}
            onFileSelect={setHeroImageFile}
            label="Hero Background Image"
          />
        </TabsContent>

        <TabsContent value="about" className="space-y-4 pt-4">
          <div>
            <Label>About Title</Label>
            <Input value={settings.about_title || ""} onChange={(e) => updateField("about_title", e.target.value)} />
          </div>
          <div>
            <Label>About Bio</Label>
            <Textarea value={settings.about_bio || ""} onChange={(e) => updateField("about_bio", e.target.value)} rows={6} />
          </div>
          <ImageUploader
            currentImageUrl={settings.about_image || undefined}
            onFileSelect={setAboutImageFile}
            label="About Image"
          />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 pt-4">
          <div>
            <Label>Email</Label>
            <Input value={settings.contact_email || ""} onChange={(e) => updateField("contact_email", e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={settings.contact_phone || ""} onChange={(e) => updateField("contact_phone", e.target.value)} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={settings.contact_location || ""} onChange={(e) => updateField("contact_location", e.target.value)} />
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 pt-4">
          <div>
            <Label>Instagram URL</Label>
            <Input value={settings.social_instagram || ""} onChange={(e) => updateField("social_instagram", e.target.value)} />
          </div>
          <div>
            <Label>Facebook URL</Label>
            <Input value={settings.social_facebook || ""} onChange={(e) => updateField("social_facebook", e.target.value)} />
          </div>
          <div>
            <Label>TikTok URL</Label>
            <Input value={settings.social_tiktok || ""} onChange={(e) => updateField("social_tiktok", e.target.value)} />
          </div>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4 pt-4">
          <div>
            <Label>Footer Text</Label>
            <Textarea value={settings.footer_text || ""} onChange={(e) => updateField("footer_text", e.target.value)} rows={3} />
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  );
}
