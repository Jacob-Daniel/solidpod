import { Session } from "@inrupt/solid-client-authn-browser";

const solidSession = typeof window !== "undefined"
  ? new Session({ storage: window.localStorage })
  : null;
export default solidSession;
