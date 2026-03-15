import type { Session } from "@inrupt/solid-client-authn-browser";
import { ensureContainerWithACL } from "@/lib/ensureContainerWithACL";
import { overwriteFile } from "@inrupt/solid-client";

export async function uploadFile(
  session: Session,
  file: File,
  podRoot: string,
  containerPath = "archive/uploads/",
  visibility = false,
): Promise<string> {
  const uploadUrl = new URL(containerPath, podRoot).toString();

  if (!session || !session.info.isLoggedIn) {
    throw new Error("No valid Solid session available");
  }

  await ensureContainerWithACL(
    session,
    uploadUrl,
    visibility ? "public" : "private",
  );

  // sanitize filename
  const slug = file.name
    .trim()
    .replace(/\/+$/, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  const finalUrl = uploadUrl + slug;

  await overwriteFile(finalUrl, file, {
    contentType: file.type,
    fetch: session.fetch,
  });

  return finalUrl;
}
