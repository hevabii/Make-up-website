import { Testimonial } from "@/types/database";
import { mockTestimonials } from "@/lib/mock-data";

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  return mockTestimonials.filter((t) => t.is_published && t.is_featured);
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  return mockTestimonials.filter((t) => t.is_published);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return [...mockTestimonials];
}
