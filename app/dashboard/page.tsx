import { getAPI } from "@/lib/functions";
import type { Page, Category } from "@/lib/types";
import Dashboard from "@/app/components/Dashboard";

async function fetchPage() {
  return getAPI<Page[]>(
    `/pages?filters[slug][$eq]=dashboard&populate[sections][on][content.content][populate]=*&populate[sidebar][on][layout.sidebar][populate]=*&populate[sidebar][on][layout.navigation][populate][navigation_menu][populate]=*`,
  );
}

async function fetchCategory() {
  return getAPI<Category[]>(`/categories`);
}

export default async function DashboardPage() {
  const [[page], cats] = await Promise.all([fetchPage(), fetchCategory()]);

  return <Dashboard page={page} cats={cats} />;
}
