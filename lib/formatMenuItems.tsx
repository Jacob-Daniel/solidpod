"use client";
import { MenuItem } from "@/lib/types";

interface FormatOptions {
  isLoggedIn: boolean;
  fullName?: string;
}

export function formatMenuItems(
  items: MenuItem[] = [],
  { isLoggedIn, fullName }: FormatOptions,
) {
  return items
    .filter((item) => !item.parent)
    .map((item) => {
      const isLoginItem = item.label.toLowerCase() === "login";
      const isNewArchive = item.slug.toLowerCase() === "new-archive";
      const isDashboard = item.slug.toLowerCase() === "dashboard";
      const userDisplayName = fullName || "My Archive";

      return {
        ...item,
        server_slug: item.slug,
        slug:
          isLoginItem && isLoggedIn
            ? "logout"
            : isNewArchive && !isLoggedIn
              ? "login"
              : item.slug,
        label:
          isLoginItem && isLoggedIn
            ? "Logout"
            : isDashboard && isLoggedIn
              ? userDisplayName
              : item.label,
        hidden: (isDashboard && !isLoggedIn) || (isNewArchive && !isLoggedIn), // control rendering
      };
    })
    .filter((item) => !item.hidden);
}
