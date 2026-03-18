import {
  buildThing,
  createSolidDataset,
  createThing,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import namespace from "@rdfjs/namespace";
import { ensureContainerWithACL } from "@/lib/ensureContainerWithACL";
import { sanitizeStringTurtle } from "@/lib/solid/sanitizeStringTurtle";

import { checkVerifiedAction } from "./actions";

const DCTERMS = namespace("http://purl.org/dc/terms/");
const SCHEMA = namespace("http://schema.org/");
const EX = namespace("https://your-domain.com/vocab#");

interface ArchiveResource {
  title: string;
  description: string;
  date?: string;
  creator: string;
  visibility: boolean;
  category: string;
  image?: string;
  documentUrl?: string;
  allowAnnotations?: boolean;
}

export async function createArchiveResource(
  session: Session,
  resource: ArchiveResource,
) {
  if (!session.info.webId) throw new Error("User not logged in");
  const verified = await checkVerifiedAction(session.info.webId!);
  if (!verified)
    throw new Error(
      "Your account is pending verification. Please wait for approval before creating resources.",
    );
  // Base WebID folder
  const url = new URL(session.info.webId);
  url.hash = "";
  const webIdBase = url.href.replace(/profile\/card$/, "");
  const resourceVisibility = resource.visibility ? "public" : "private";

  // Top-level archive container
  const topArchiveFolder = new URL("archive/", webIdBase).toString();
  await ensureContainerWithACL(session, topArchiveFolder, "public"); // top-level archive is public

  // Category and uploads containers
  const archiveFolder = new URL(
    `archive/${resource.category}/`,
    webIdBase,
  ).toString();
  const uploadsFolder = new URL("archive/uploads/", webIdBase).toString();

  await ensureContainerWithACL(session, archiveFolder, resourceVisibility);
  await ensureContainerWithACL(session, uploadsFolder, resourceVisibility);

  // Sanitize title and build fragment
  const slug = sanitizeStringTurtle(resource.title);
  const timestamp = Date.now();
  const fragment = `${slug}-${timestamp}`;

  // Create dataset and Thing
  let dataset = createSolidDataset();
  let builder = buildThing(createThing({ name: fragment }))
    .addStringNoLocale(DCTERMS("title"), resource.title)
    .addStringNoLocale(DCTERMS("description"), resource.description)
    .addDatetime(
      DCTERMS("created"),
      new Date(resource.date ?? Date.now()), // <-- default to now if undefined
    )
    .addUrl(DCTERMS("creator"), resource.creator)
    .addStringNoLocale(EX("slug"), slug)
    .addBoolean(EX("allowAnnotations"), resource.allowAnnotations ?? false) // <-- default false
    .addStringNoLocale(EX("category"), resource.category);

  if (resource.documentUrl) {
    builder = builder.addUrl(SCHEMA("contentUrl"), resource.documentUrl);
  }

  if (resource.image) {
    builder = builder.addUrl(SCHEMA("image"), resource.image);
  }

  const resourceThing = builder.build();

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

  if (resource.visibility === true) {
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

  fetch(`${process.env.FRONT_END_URL}/api/revalidate-archive`, {
    method: "POST",
  }).catch(console.error);

  return { resourceUrl, fragment };
}
