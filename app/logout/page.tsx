// app/logout/page.tsx
"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    // Trigger logout on load, then redirect
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="pb-20 px-5">
      <div className="lg:min-h-[600px] z-50 col-span-12 grid grid-cols-12 col-span-12 lg:px-0 lg:col-start-2 lg:col-span-10">
        <section className="z-50 min-h-[100%] col-span-12 md:col-start-5 md:col-span-4 justify-center py-10 pt-20 md:pt-32">
          <h2 className="text-3xl z-50 font-sans">
            Logging Out and Redirecting ...
          </h2>
        </section>
      </div>
    </div>
  );
}
