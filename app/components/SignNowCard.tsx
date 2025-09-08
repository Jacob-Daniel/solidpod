"use client";
import React from "react";
import { ButtonSection } from "@/lib/types";
import StaticIcon from "@/app/components/StaticIcon";
const SignNowCard = ({
  count,
  button,
  classes,
}: {
  count: number;
  button: ButtonSection;
  classes: string;
}) => {
  const handleClick = () => {
    const targetEl = document.getElementById(button.hash);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className={`w-full px-3 pb-3 relative mb-2 flex justify-center ${classes}`}
    >
      <div className="h-[60px] bg-white px-7 pt-4 pb-4 rounded border-b w-65 border-gray-200 dark:border-zinc-800 dark:border-zinc-800 -top-12 absolute z-50 flex gap-x-7 justify-center items-center">
        <button
          className="font-bold font-sans bg-yellow-400 rounded-md px-3 py-1 flex gap-x-1 items-center"
          onClick={handleClick}
        >
          <StaticIcon
            iconName={button.icon}
            color="black"
            className="mb-0 text-slate-600/40 block"
          />
          {button.label}
        </button>
        <div className="flex flex-col h-full items-center justify-center gap-y-3">
          <span className="leading-2 font-bold text-xl">{count}</span>
          <span className="text-sm leading-0">Signed</span>
        </div>
      </div>
    </div>
  );
};

export default SignNowCard;
