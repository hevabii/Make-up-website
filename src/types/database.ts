export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  cover_image_url: string | null;
  images: string[];
  is_featured: boolean;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_note: string | null;
  duration: string | null;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  content: string;
  image_url: string | null;
  service_type: string | null;
  rating: number | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_interest: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
  updated_at: string;
}

export interface BlockedSlot {
  id: string;
  slot_date: string;
  slot_hour: number;
  reason: string | null;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  type: "text" | "rich_text" | "image" | "json";
  created_at: string;
  updated_at: string;
}
