import {
  getSolidDataset,
  // createSolidDataset,
  // saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";

export async function ensureContainerWithACL(
  session: Session,
  containerUrl: string,
  visibility: "private" | "public" = "private",
  overwriteAcl = true,
) {
  try {
    // Try to fetch the container
    await getSolidDataset(containerUrl, { fetch: session.fetch });
    console.log("Container exists:", containerUrl);
  } catch (err: any) {
    console.log("Container missing, creating:", containerUrl);
    const response = await session.fetch(containerUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "text/turtle",
        Link: '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
      },
      body: "",
    });
    if (!response.ok)
      throw new Error(`Failed to create container: ${response.status}`);
  }

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

  // Always write ACL if overwriteAcl=true
  if (overwriteAcl) {
    const aclUrl = containerUrl + ".acl";
    const aclResponse = await session.fetch(aclUrl, {
      method: "PUT",
      headers: { "Content-Type": "text/turtle" },
      body: aclContent,
    });
    if (!aclResponse.ok)
      throw new Error(`Failed to create/update ACL: ${aclResponse.status}`);
    console.log("ACL written for container:", containerUrl);
  }
}
