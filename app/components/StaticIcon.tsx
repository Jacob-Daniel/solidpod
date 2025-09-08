"use client";

import {
  FaInfoCircle,
  FaPlayCircle,
  FaArchive,
  FaGlobe,
  FaPen,
  FaFire,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  FaInfoCircle,
  FaPlayCircle,
  FaArchive,
  FaGlobe,
  FaPen,
  FaFire,
  FaMoon,
  FaSun,
};

export default function StaticIcon({
  iconName,
  className,
  color,
}: {
  iconName: string;
  className?: string;
  color?: string;
}) {
  const Icon = iconMap[iconName];

  if (!Icon) {
    console.warn(`Unknown icon: ${iconName}`);
    return null;
  }

  return <Icon className={className} color={color} />;
}
