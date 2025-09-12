import {
  getSolidDataset,
  saveFileInContainer,
  createContainerAt,
  setAgentResourceAccess,
  setPublicResourceAccess,
  saveAclFor,
  WithResourceInfo,
  createAcl,
  WithAccessibleAcl,
  universalAccess,
} from "@inrupt/solid-client";

export async function uploadAvatar(
  file: File,
  podRoot: string,
  session: any,
  permissions: { private: boolean; public: boolean }, // <- user selects
): Promise<string> {
  const uploadUrl = podRoot + "images/";

  try {
    await createContainerAt(uploadUrl, { fetch: session.fetch });
  } catch (e: any) {
    if (e.statusCode !== 409) throw e;
  }

  const savedFile = await saveFileInContainer(uploadUrl, file, {
    slug: file.name,
    contentType: file.type,
    fetch: session.fetch,
  });

  const fileUrl = savedFile.internal_resourceInfo.sourceIri!;

  // Public read access
  if (permissions.public) {
    await universalAccess.setPublicAccess(
      fileUrl,
      { read: true },
      { fetch: session.fetch },
    );
  }

  // Private: by default only the user can read/write, so we don't need extra ACL
  // (the Universal API automatically keeps it private if public is false)

  return fileUrl;
}
