import { getAllPortfolioItems } from "@/lib/queries/portfolio";
import { PortfolioManager } from "./portfolio-manager";

export default async function AdminPortfolioPage() {
  const items = await getAllPortfolioItems();
  return <PortfolioManager initialItems={items} />;
}
