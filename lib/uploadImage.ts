import { saveFileInContainer, universalAccess } from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { ensureContainerWithACL } from "./EnsureContainerWithACL";

export async function uploadImage(
  file: File,
  podRoot: string, // e.g., http://localhost:3000/tobynklarchive/
  session: Session,
  permissions: { private: boolean; public: boolean },
): Promise<string> {
  // Construct the uploads container URL under the user's pod
  const uploadContainer = new URL("archive/uploads/", podRoot).toString();

  // Ensure the container exists with ACL
  await ensureContainerWithACL(session, uploadContainer);

  // Save file inside the container
  const savedFile = await saveFileInContainer(uploadContainer, file, {
    slug: file.name,
    contentType: file.type,
    fetch: session.fetch,
  });

  const fileUrl = savedFile.internal_resourceInfo.sourceIri!;

  // Set permissions if requested
  if (permissions.public) {
    await universalAccess.setPublicAccess(
      fileUrl,
      { read: true },
      { fetch: session.fetch },
    );
  }

  return fileUrl;
}
