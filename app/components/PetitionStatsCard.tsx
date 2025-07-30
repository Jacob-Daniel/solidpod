"use client";
import StaticIcon from "@/app/components/StaticIcon";
import { formatDate } from "@/lib/clientFunctions";
interface StatsCardProps {
  signatureCount: number;
  targetCount: number;
  title: string;
  endDate: string;
  slug: string;
  lastSignature: string;
}

const PetitionStatsCard = ({
  signatureCount,
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
    Math.round((signatureCount / targetCount) * 100),
    100,
  );
  const daysRemaining = Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return (
    <div className="flex flex-row text-base gap-3 justify-end w-full">
      <StatBlock value={signatureCount} label="Supporters" type="sup" />
      <StatBlock value={daysRemaining} label="Days left" type="days" />

      {isActive(lastSignature) && (
        <span className="border border-gray-200 rounded px-2 py-1 text-xs">
          {formatDate(new Date(lastSignature), true, true)} Last signature
          <StaticIcon
            iconName="faFire"
            color="red"
            className="mb-0 text-slate-600/40 block"
          />
        </span>
      )}
    </div>
  );
};

const StatBlock = ({
  value,
  label,
  type,
  delta,
}: {
  value: number;
  label: string;
  type: string;
  delta?: number;
}) => (
  <span className="border border-gray-200 rounded px-2 py-1 text-base">
    {value} {label}{" "}
    {type === "sup" && value > 10 && (
      <StaticIcon
        iconName="FaFire"
        color=""
        className="mb-0 inline text-yellow-500 animate-pulse"
      />
    )}{" "}
    {type === "days" && value < 10 && (
      <span
        className="z-50 w-3 h-3 rounded-full bg-red-600 animate-pulse-hot inline-block"
        title="Hot Petition!"
      />
    )}
  </span>
);

export default PetitionStatsCard;
