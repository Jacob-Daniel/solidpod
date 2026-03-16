import {
  getSolidDataset,
  getContainedResourceUrlAll,
} from "@inrupt/solid-client";

async function getCategoryResources(base: string, category: string) {
  const containerUrl = `${base}/archive/${category}/`;
  try {
    const dataset = await getSolidDataset(containerUrl);
    return getContainedResourceUrlAll(dataset);
  } catch (err: any) {
    return [];
  }
}

export async function buildCategoryResources(
  webIds: string[],
  categories: string[],
) {
  const archiveBases = webIds.map((w) => w.replace(/\/profile\/card#.*$/, ""));
  const categoryResources: { [category: string]: string[] } = {};

  for (const cat of categories) {
    const allResources: string[] = [];
    for (const base of archiveBases) {
      const res = await getCategoryResources(base, cat);
      allResources.push(...res);
    }
    categoryResources[cat] = allResources;
  }

  return categoryResources;
}
