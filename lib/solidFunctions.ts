"use client";

import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
} from "@inrupt/solid-client";

const FOAF = "http://xmlns.com/foaf/0.1/";

const FOAF_NAME = "http://xmlns.com/foaf/0.1/name";

export async function getNameFromWebId(webId: string): Promise<string> {
  try {
    const profileDoc = webId.split("#")[0];
    const dataset = await getSolidDataset(profileDoc);

    const me = getThing(dataset, webId); // use full IRI including #me
    if (!me) return "Unknown";

    return getStringNoLocale(me, FOAF_NAME) || "Unknown";
  } catch (e) {
    console.error("Error fetching WebID profile:", e);
    return "Unknown";
  }
}

export function getUsernameFromWebId(webId: string) {
  try {
    const url = new URL(webId);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    // Return the first segment after domain or fallback to hostname
    return pathSegments[0] || url.hostname;
  } catch {
    return webId;
  }
}
