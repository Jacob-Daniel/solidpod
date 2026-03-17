import type { Session } from "@inrupt/solid-client-authn-browser";
import { ensureContainerWithACL } from "@/lib/ensureContainerWithACL";
import { overwriteFile } from "@inrupt/solid-client";
import { sanitiseFilename, extensionToMime } from "@/lib/solid/sanitiseFile";

export async function uploadFile(
  session: Session,
  file: File,
  podRoot: string,
  containerPath = "archive/uploads/",
  visibility = false,
): Promise<string> {
  if (!session?.info.isLoggedIn) {
    throw new Error("No valid Solid session available");
  }

  const uploadUrl = new URL(containerPath, podRoot).toString();

  await ensureContainerWithACL(
    session,
    uploadUrl,
    visibility ? "public" : "private",
  );

  // Caller (FileInputUpload) has already run sanitiseFile —
  // file.name is already safe. We re-run sanitiseFilename here
  // as a defensive backstop only, in case uploadFile is called
  // directly without going through the component.
  const slug = sanitiseFilename(file.name);
  if (!slug) throw new Error("Filename could not be sanitised.");

  const finalUrl = uploadUrl + slug;

  // Derive content-type from extension — never trust file.type alone
  const contentType = extensionToMime(slug) ?? "application/octet-stream";

  await overwriteFile(finalUrl, file, {
    contentType,
    fetch: session.fetch,
  });

  return finalUrl;
}
