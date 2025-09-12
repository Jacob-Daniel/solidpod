import {
  getSolidDataset,
  createSolidDataset,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";

export async function ensureContainerWithACL(
  session: Session,
  containerUrl: string,
  visibility: "private" | "public" = "private",
) {
  console.log(visibility, "visibility");
  try {
    // Try to fetch the container
    await getSolidDataset(containerUrl, { fetch: session.fetch });
    console.log("Container exists:", containerUrl);
  } catch (err) {
    console.log("Container missing, creating:", containerUrl);

    // Create empty container
    await saveSolidDatasetAt(containerUrl, createSolidDataset(), {
      fetch: session.fetch,
    });

    // Build ACL content
    let aclContent = `@prefix acl: <http://www.w3.org/ns/auth/acl#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.

<#owner>
    a acl:Authorization;
    acl:agent <${session.info.webId}>;
    acl:accessTo <./>;
    acl:default <./>;
    acl:mode acl:Read, acl:Write, acl:Append, acl:Control.
`;

    // Add public read if visibility is public
    if (visibility === "public") {
      aclContent += `
<#public>
    a acl:Authorization;
    acl:agentClass foaf:Agent;
    acl:accessTo <./>;
    acl:default <./>;
    acl:mode acl:Read.
`;
    }

    // Determine ACL URL
    const aclUrl = containerUrl.endsWith("/")
      ? containerUrl + ".acl"
      : containerUrl + "/.acl";

    const response = await session.fetch(aclUrl, {
      method: "PUT",
      headers: { "Content-Type": "text/turtle" },
      body: aclContent,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create ACL for container: ${response.status} ${response.statusText}`,
      );
    }

    console.log("ACL created for container:", aclUrl);
  }
}
