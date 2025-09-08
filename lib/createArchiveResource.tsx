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
import { sanitizeStringTurtle } from "@/lib/sanitizeStringTurtle";

const DC = namespace("http://purl.org/dc/terms/");

interface ArchiveResource {
  title: string;
  description: string;
  date: string;
  creator: string;
  visibility?: "private" | "public";
  category: string;
}

export async function createArchiveResource(
  session: Session,
  resource: ArchiveResource,
) {
  if (!session.info.webId) throw new Error("User not logged in");
  // console.log(resource.category, "cat");
  // Base WebID folder
  const url = new URL(session.info.webId);
  url.hash = "";
  const webId = url.href.replace(/profile\/card$/, "");
  const archiveFolder = new URL(
    `archive/${resource.category}/`,
    webId,
  ).toString();

  await ensureContainerWithACL(session, archiveFolder);

  // Sanitize title for Turtle
  const sanitizedTitle = sanitizeStringTurtle(resource.title);
  const timestamp = Date.now();
  const fragment = `${sanitizedTitle}-${timestamp}`; // fragment matches filename

  // Create dataset and Thing
  let dataset = createSolidDataset();
  const resourceThing = buildThing(createThing({ name: fragment }))
    .addStringNoLocale(DC("title"), resource.title)
    .addStringNoLocale(DC("description"), resource.description)
    .addStringNoLocale(DC("date"), resource.date)
    .addUrl(DC("creator"), resource.creator)
    .build();

  dataset = setThing(dataset, resourceThing);

  // File URL
  const filename = `${fragment}.ttl`;
  const resourceUrl = archiveFolder + encodeURIComponent(filename);

  await saveSolidDatasetAt(resourceUrl, dataset, { fetch: session.fetch });

  // ACL (optional)
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
  await session.fetch(aclUrl, {
    method: "PUT",
    headers: { "Content-Type": "text/turtle" },
    body: aclContent,
  });

  return { resourceUrl, fragment };
}
