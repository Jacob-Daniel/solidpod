import { Session } from "@inrupt/solid-client-authn-browser";

export const session = new Session();

export async function handleIncomingRedirect(
  restorePreviousSession = true,
): Promise<void> {
  await session.handleIncomingRedirect({ restorePreviousSession });
}

export async function login(
  oidcIssuer: string,
  redirectUrl: string = `${window.location.origin}/dashboard`,
) {
  await session.login({
    oidcIssuer,
    redirectUrl,
    clientName: "My Solid React App",
  });
}

export async function logout() {
  await session.logout();
}
