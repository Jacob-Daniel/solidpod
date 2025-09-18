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
    // console.warn(
    //   `Container missing or unauthorized: ${containerUrl}`,
    //   err.message,
    // );
    return [];
  }
}

export async function buildCategoryResources(
  webIds: string[],
  categories: string[],
) {
  const archiveBases = webIds.map((w) => w.replace(/\/profile\/card#me$/, ""));
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
