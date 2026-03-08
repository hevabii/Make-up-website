import { getAllServices } from "@/lib/queries/services";
import { ServicesManager } from "./services-manager";

export default async function AdminServicesPage() {
  const services = await getAllServices();
  return <ServicesManager initialItems={services} />;
}
