"use client";

import { useState, useEffect, ReactNode } from "react";

export default function BannerOverlay({
  style,
  className,
  children,
}: {
  style: string | undefined;
  className: string;
  children: ReactNode;
}) {
  const [state, setState] = useState("hidden");

  useEffect(() => {
    setState("block");
  }, []);

  return (
    <div
      style={{
        backgroundColor: style,
      }}
      className={`${className} ${state}`}
    >
      {children}
    </div>
  );
}
