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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true); // run only once on mount
  }, []);

  return (
    <div
      style={{
        backgroundColor: style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
