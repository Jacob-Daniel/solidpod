"use client";

// import { Progress } from '@/components/ui/progress'; // Or your preferred UI library

interface StatsCardProps {
  signaturesCount: number;
  targetCount: number;
  title: string;
  summary: string;
  endDate: string;
  slug: string;
}

const PetitionStatsCard = ({
  signaturesCount,
  targetCount,
  title,
  summary,
  endDate,
}: StatsCardProps) => {
  const progressPercentage = Math.min(
    Math.round((signaturesCount / targetCount) * 100),
    100,
  );
  const daysRemaining = Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="flex flex-row text-sm gap-3 justify-end w-full text-white">
      <StatBlock
        value={signaturesCount}
        label="Supporters"
        icon="👥"
        delta={15} // You would calculate this from your data
      />
      <StatBlock value={daysRemaining} label="Days left" icon="⏳" />
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
  <span className="border border-blue-500 rounded px-2 py-1 text-xs">
    {value} {label}
  </span>
);

export default PetitionStatsCard;
