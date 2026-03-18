"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { session, handleIncomingRedirect, login } from "@/lib/solidSession";
import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { checkVerifiedAction } from "@/lib/actions";
// import { FOAF, VCARD, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { FOAF } from "@inrupt/vocab-common-rdf";

interface SessionContextType {
  session: typeof session;
  isLoggedIn: boolean;
  isVerified: boolean;
  login: typeof login;
  logout: () => Promise<void>;
  fullName?: string;
  email?: string;
  webId?: string;
  user?: any; // optional, store Strapi user info
  setUser?: (user: any) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SolidSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(session.info.isLoggedIn);
  const [fullName, setFullName] = useState<string>("");
  // const [email, setEmail] = useState<string>("");
  const [webId, setWebId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    (async () => {
      await handleIncomingRedirect();

      const loggedIn = session.info.isLoggedIn;
      const currentWebId = session.info.webId;
      setIsLoggedIn(loggedIn);
      setWebId(currentWebId);
      if (!loggedIn || !currentWebId) {
        setIsVerified(false);
        return;
      }
      checkVerifiedAction(currentWebId).then(setIsVerified);

      if (session.info.isLoggedIn && session.info.webId) {
        try {
          const profileDocUrl = session.info.webId.split("#")[0];
          const dataset = await getSolidDataset(profileDocUrl, {
            fetch: session.fetch,
          });
          const thing = getThing(dataset, session.info.webId);

          if (thing) {
            const foafName = getStringNoLocale(thing, FOAF.name);
            const fullname =
              foafName && foafName.trim() !== "" ? foafName : undefined;

            setFullName(fullname || "");

            // const schemaEmail = getStringNoLocale(thing, VCARD.hasEmail); // or SCHEMA_INRUPT.email

            setFullName(fullname || "");
            // setEmail(schemaEmail || "");
          }
        } catch (err) {
          console.error("Error fetching Solid profile:", err);
        }
      }
    })();
  }, [isLoggedIn, webId]);

  const doLogout = async () => {
    await session.logout();
    setIsLoggedIn(false);
    setFullName("");
    setWebId(undefined);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoggedIn,
        login,
        logout: doLogout,
        fullName,
        webId,
        user,
        setUser,
        isVerified,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSolidSession = (): SessionContextType => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
};
