import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { getAllSettings } from "@/lib/queries/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAllSettings();

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
