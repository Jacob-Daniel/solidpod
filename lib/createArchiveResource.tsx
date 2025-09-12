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
  visibility: boolean;
  category: string;
  image: string;
}

export async function createArchiveResource(
  session: Session,
  resource: ArchiveResource,
) {
  if (!session.info.webId) throw new Error("User not logged in");

  // Base WebID folder
  const url = new URL(session.info.webId);
  url.hash = "";
  const webIdBase = url.href.replace(/profile\/card$/, "");
  const resourceVisibility = !resource.visibility ? "private" : "public";
  // Archive container and uploads container
  const archiveFolder = new URL(
    `archive/${resource.category}/`,
    webIdBase,
  ).toString();
  const uploadsFolder = new URL("archive/uploads/", webIdBase).toString();

  // Ensure containers exist and have correct ACLs
  await ensureContainerWithACL(session, archiveFolder, resourceVisibility);
  await ensureContainerWithACL(session, uploadsFolder, resourceVisibility);

  // Sanitize title and build fragment
  const sanitizedTitle = sanitizeStringTurtle(resource.title);
  const timestamp = Date.now();
  const fragment = `${sanitizedTitle}-${timestamp}`;

  // Create dataset and Thing
  let dataset = createSolidDataset();
  const resourceThing = buildThing(createThing({ name: fragment }))
    .addStringNoLocale(DC("title"), resource.title)
    .addStringNoLocale(DC("description"), resource.description)
    .addStringNoLocale(DC("date"), resource.date)
    .addStringNoLocale(DC("img"), resource.image)
    .addUrl(DC("creator"), resource.creator)
    .build();

  dataset = setThing(dataset, resourceThing);

  // File URL
  const filename = `${fragment}.ttl`;
  const resourceUrl = archiveFolder + encodeURIComponent(filename);

  // Save dataset
  await saveSolidDatasetAt(resourceUrl, dataset, { fetch: session.fetch });

  // Resource ACL
  let resourceACL = `@prefix acl: <http://www.w3.org/ns/auth/acl#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.

<#owner>
    a acl:Authorization;
    acl:agent <${session.info.webId}>;
    acl:accessTo <./${filename}>;
    acl:mode acl:Read, acl:Write, acl:Append, acl:Control.
`;

  if (resource.visibility === "public") {
    resourceACL += `
<#public>
    a acl:Authorization;
    acl:agentClass foaf:Agent;
    acl:accessTo <./${filename}>;
    acl:mode acl:Read.
`;
  }

  const aclUrl = resourceUrl + ".acl";
  await session.fetch(aclUrl, {
    method: "PUT",
    headers: { "Content-Type": "text/turtle" },
    body: resourceACL,
  });

  return { resourceUrl, fragment };
}
