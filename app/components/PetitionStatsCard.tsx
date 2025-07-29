"use client";
import { FaFire } from "react-icons/fa";

interface StatsCardProps {
  signaturesCount: number;
  targetCount: number;
  title: string;
  endDate: string;
  slug: string;
  lastSignature: string;
}

const PetitionStatsCard = ({
  signaturesCount,
  targetCount,
  title,
  endDate,
  lastSignature,
}: StatsCardProps) => {
  console.log(lastSignature, "last");
  const isActive = (lastSignature: string) => {
    const now = new Date();
    const last = new Date(lastSignature); // Use raw date object here
    const diff = now.getTime() - last.getTime();
    return diff < 1000 * 60 * 60; // 1 hour
  };

  const progressPercentage = Math.min(
    Math.round((signaturesCount / targetCount) * 100),
    100,
  );
  const daysRemaining = Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="flex flex-row text-sm gap-3 justify-end w-full">
      <StatBlock
        value={signaturesCount}
        label="Supporters"
        icon="👥"
        delta={15} // You would calculate this from your data
      />
      <StatBlock value={daysRemaining} label="Days left" icon="⏳" />
      {isActive(lastSignature) && (
        <FaFire
          className="text-yellow-600 animate-pulse-hot"
          title="Active petition"
        />
      )}
    </div>
  );
};

const StatBlock = ({
  value,
  label,
  icon,
  delta,
}: {
  value: string | number;
  label: string;
  icon: string;
  delta?: number;
}) => (
  <span className="border border-gray-200 rounded px-2 py-1 text-xs">
    {value} {label}
  </span>
);

export default PetitionStatsCard;
