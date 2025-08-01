"use client";
import React, { useState } from "react";
import SolidLogin from "./SolidLogin";

export default function SolidAuthFlow() {
  const [solidServer] = useState("https://gardenmap.jacobdaniel.co.uk");
  return (
    <div className="w-100 bg-blue-200 p-2">
      <SolidLogin solidServer={solidServer} />
    </div>
  );
}
