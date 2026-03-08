import Link from "next/link";
import { getAllPortfolioItems } from "@/lib/queries/portfolio";
import { getAllServices } from "@/lib/queries/services";
import { getAllTestimonials } from "@/lib/queries/testimonials";
import { getAllInquiries, getNewInquiryCount } from "@/lib/queries/inquiries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, Sparkles, MessageSquare, Mail } from "lucide-react";

export default async function AdminDashboard() {
  const [portfolio, services, testimonials, inquiries, newCount] = await Promise.all([
    getAllPortfolioItems(),
    getAllServices(),
    getAllTestimonials(),
    getAllInquiries(),
    getNewInquiryCount(),
  ]);

  const recentInquiries = inquiries.slice(0, 5);

  const stats = [
    { label: "Portfolio Items", value: portfolio.length, icon: Image, href: "/admin/portfolio" },
    { label: "Active Services", value: services.filter((s) => s.is_active).length, icon: Sparkles, href: "/admin/services" },
    { label: "New Inquiries", value: newCount, icon: Mail, href: "/admin/inquiries" },
    { label: "Testimonials", value: testimonials.length, icon: MessageSquare, href: "/admin/testimonials" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your site.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-gray-500">No inquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className={`text-sm font-medium ${inquiry.status === "new" ? "font-bold" : ""}`}>
                        {inquiry.name}
                      </p>
                      <p className="text-xs text-gray-500">{inquiry.email}</p>
                    </div>
                    <Badge variant={inquiry.status === "new" ? "default" : "secondary"}>
                      {inquiry.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/portfolio">
              <Button className="w-full justify-start" variant="outline">
                <Image className="mr-2 h-4 w-4" /> Add Portfolio Item
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button className="w-full justify-start mt-2" variant="outline">
                View Live Site
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
