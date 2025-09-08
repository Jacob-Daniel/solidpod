import {
  buildThing,
  createSolidDataset,
  createThing,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import namespace from "@rdfjs/namespace";
import { ensureContainerWithACL } from "@/lib/EnsureContainerWithACL";
const DC = namespace("http://purl.org/dc/terms/");

interface ArchiveResource {
  title: string;
  description: string;
  date: string; // ISO string
  creator: string; // WebID
  visibility?: "private" | "public"; // optional
}

export async function createArchiveResource(
  session: Session,
  resource: ArchiveResource,
) {
  if (!session.info.webId) throw new Error("User not logged in");

  const url = new URL(session.info.webId);
  url.hash = "";
  const webId = url.href.replace(/profile\/card$/, "");

  const archiveFolder = new URL("archive/", webId).toString();

  await ensureContainerWithACL(session, archiveFolder);

  console.log("Archive folder URL:", archiveFolder);

  // Create new dataset for the resource
  let dataset = createSolidDataset();

  // Create a thing representing this resource
  const resourceThing = buildThing(createThing({ name: resource.title }))
    .addStringNoLocale(DC("title"), resource.title)
    .addStringNoLocale(DC("description"), resource.description)
    .addStringNoLocale(DC("date"), resource.date)
    .addUrl(DC("creator"), resource.creator)
    .build();

  dataset = setThing(dataset, resourceThing);

  // Generate a unique filename (timestamp-based)
  const timestamp = Date.now();
  const filename =
    encodeURIComponent(resource.title + "-" + timestamp) + ".ttl";
  const resourceUrl = archiveFolder + filename;

  try {
    // Save the resource dataset
    await saveSolidDatasetAt(resourceUrl, dataset, { fetch: session.fetch });
    console.log("Resource Saved:", resourceUrl);
  } catch (err) {
    console.error("Error saving:", err);
  }

  // Generate ACL content per resource
  let aclContent = `@prefix acl: <http://www.w3.org/ns/auth/acl#>.

<#owner>
    a acl:Authorization;
    acl:agent <${session.info.webId}>;
    acl:accessTo <./${filename}>;
    acl:mode acl:Read, acl:Write, acl:Control.
`;

  if (resource.visibility === "public") {
    aclContent += `
<#public>
    a acl:Authorization;
    acl:agentClass acl:AuthenticatedAgent;
    acl:accessTo <./${filename}>;
    acl:mode acl:Read.
`;
  }

  const aclUrl = resourceUrl + ".acl";
  try {
    // Save the ACL file
    const res = await session.fetch(aclUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "text/turtle",
      },
      body: aclContent,
    });
    console.log("ACL PUT Res:", res.status, res.statusText);
  } catch (err) {
    console.error("Error Saving ACL:", err);
  }

  return resourceUrl;
}
