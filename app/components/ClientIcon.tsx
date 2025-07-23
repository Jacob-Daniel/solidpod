"use client";
import dynamic from "next/dynamic";

const DynamicIcon = dynamic(() => import("@/app/components/Icon"), {
  loading: () => <div>Loading DynamicIcon...</div>,
  ssr: false,
});

export default DynamicIcon;
