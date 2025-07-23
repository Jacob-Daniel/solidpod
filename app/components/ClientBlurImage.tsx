"use client";
import dynamic from "next/dynamic";

const BlurImage = dynamic(() => import("./BlurImage"), {
  loading: () => (
    <div className="bg-gray-200 w-full h-[400px] flex justify-center items-center font-sans">
      Loading image...
    </div>
  ),
});

export default BlurImage;
