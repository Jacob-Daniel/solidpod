import {
  getSolidDataset,
  getContainedResourceUrlAll,
} from "@inrupt/solid-client";

export async function loadResources(
  archiveUrl: string,
  fetch: typeof window.fetch,
) {
  const dataset = await getSolidDataset(archiveUrl, { fetch });
  const contained = getContainedResourceUrlAll(dataset);
  const categoryUrls = contained.filter(
    (url) => url.endsWith("/") && !url.endsWith("/uploads/"),
  );

  const results: { name: string; resources: string[] }[] = [];

  for (const catUrl of categoryUrls) {
    try {
      const catDataset = await getSolidDataset(catUrl, { fetch });
      const catResources = getContainedResourceUrlAll(catDataset);

      results.push({
        name: catUrl.replace(archiveUrl, "").replace(/\/$/, ""),
        resources: catResources,
      });
    } catch (err) {
      console.warn("Could not load category:", catUrl, err);
    }
  }

  return results;
}
