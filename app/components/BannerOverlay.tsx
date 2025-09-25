"use client";

import { useState, useEffect, ReactNode } from "react";

export default function BannerOverlay({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const [state, setState] = useState("hidden");

  useEffect(() => {
    const timer = setTimeout(() => {
      setState("");
    }, 600);

    return () => clearTimeout(timer); // cleanup if component unmounts
  }, []);

  return <div className={`${className} ${state}`}>{children}</div>;
}
