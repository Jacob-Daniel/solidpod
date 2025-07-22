"use client";
import React from "react";
import * as FaIcons from "react-icons/fa";
import * as FarIcons from "react-icons/fa"; // Regular fallback (React Icons doesn't separate well)
import * as FabIcons from "react-icons/fa";
import * as GiIcons from "react-icons/gi";
import * as PiIcons from "react-icons/pi";
import * as LiaIcons from "react-icons/lia";

type IconProps = {
  icon: string; // e.g. "fa-child"
  label?: string; // optional text underneath
  color?: string; // icon color
  size?: string; // Tailwind size class, e.g., "text-4xl"
  className?: string; // any other styling
};

const convertToComponentName = (iconName: string): string => {
  return (
    "Fa" +
    iconName
      .replace(/^fa-/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("")
  );
};

const getReactIcon = (componentName: string) => {
  return (
    FaIcons[componentName as keyof typeof FaIcons] ||
    FarIcons[componentName as keyof typeof FarIcons] ||
    FabIcons[componentName as keyof typeof FabIcons] ||
    GiIcons[componentName as keyof typeof GiIcons] ||
    PiIcons[componentName as keyof typeof PiIcons] ||
    LiaIcons[componentName as keyof typeof LiaIcons] ||
    null
  );
};

export default function Icon({
  icon,
  label,
  color = "#000",
  size = "text-3xl",
  className = "",
}: IconProps) {
  const componentName = convertToComponentName(icon);
  const IconComponent = getReactIcon(icon);
  if (!IconComponent) return null;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <IconComponent style={{ color }} className={`${size}`} />
    </div>
  );
}
