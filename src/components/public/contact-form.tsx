"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { submitInquiry } from "@/lib/actions/inquiries";
import { Service } from "@/types/database";
import { ArrowRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  service_interest: z.string().optional(),
  preferred_date: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

interface ContactFormProps {
  services: Service[];
}

export function ContactForm({ services }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service_interest: "",
      preferred_date: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (cooldown) return;
    setLoading(true);
    try {
      await submitInquiry(values);
      toast.success("Thank you. Your inquiry has been received.");
      form.reset();
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full bg-transparent border-0 border-b border-[#E7E0D8] px-0 py-3 text-[14px] text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#B8977E] focus:ring-0 focus:outline-none transition-colors duration-300";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A8A29E]">
            Name *
          </label>
          <input
            {...form.register("name")}
            className={inputClassName}
            placeholder="Your full name"
          />
          {form.formState.errors.name && (
            <p className="mt-2 text-[11px] text-red-400">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A8A29E]">
            Email *
          </label>
          <input
            type="email"
            {...form.register("email")}
            className={inputClassName}
            placeholder="your@email.com"
          />
          {form.formState.errors.email && (
            <p className="mt-2 text-[11px] text-red-400">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A8A29E]">
            Phone
          </label>
          <input
            type="tel"
            {...form.register("phone")}
            className={inputClassName}
            placeholder="(555) 000-0000"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A8A29E]">
            Preferred Date
          </label>
          <input
            type="date"
            {...form.register("preferred_date")}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A8A29E]">
          Service Interest
        </label>
        <Select
          value={form.watch("service_interest")}
          onValueChange={(v) => v && form.setValue("service_interest", v)}
        >
          <SelectTrigger className="w-full bg-transparent border-0 border-b border-[#E7E0D8] rounded-none px-0 py-3 text-[14px] text-[#1C1917] focus:border-[#B8977E] focus:ring-0 shadow-none">
            <SelectValue placeholder="Select a service..." />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.name}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A8A29E]">
          Message *
        </label>
        <textarea
          {...form.register("message")}
          rows={4}
          className={`${inputClassName} resize-none`}
          placeholder="Tell me about your event, vision, or any questions..."
        />
        {form.formState.errors.message && (
          <p className="mt-2 text-[11px] text-red-400">{form.formState.errors.message.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || cooldown}
          className="btn-luxury group inline-flex items-center gap-3 border border-[#1C1917] px-10 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[#1C1917] transition-all duration-500 hover:border-[#B8977E] hover:bg-[#B8977E] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : cooldown ? "Inquiry Received" : "Send Inquiry"}
          {!loading && !cooldown && (
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </form>
  );
}
