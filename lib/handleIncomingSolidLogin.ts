import { session } from "@/lib/solidSession";
import { createArchiveAction } from "@/lib/actions";

export const handleIncomingSolidLogin = async (
  solidSessionInfo: typeof session.info,
) => {
  if (!solidSessionInfo.isLoggedIn || !solidSessionInfo.webId) return;

  const webId = solidSessionInfo.webId;
  const data = { webId: webId };
  // Fire-and-forget, safe to call multiple times
  createArchiveAction(data).catch((err) =>
    console.error("Failed to store webId:", err),
  );
};
