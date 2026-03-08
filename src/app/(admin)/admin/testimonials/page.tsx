import { getAllTestimonials } from "@/lib/queries/testimonials";
import { TestimonialsManager } from "./testimonials-manager";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();
  return <TestimonialsManager initialItems={testimonials} />;
}
