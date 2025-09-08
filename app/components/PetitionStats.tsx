import React from "react";

import type { PetitionStats, PetitionMeta } from "@/lib/types";

const PetitionStats = ({
  stats,
  data,
}: {
  stats: PetitionStats;
  data: PetitionMeta;
}) => {
  const {
    signaturesCount,
    targetCount,
    startDate,
    showTimeLeft,
    showProgressBar = true,
  } = stats;
  const { end_date, targetCount: tCount, signaturesCount: sCount } = data;
  const now = new Date();
  const endDate = end_date ? new Date(end_date) : null;
  const percentage = tCount
    ? Math.min(100, Math.round((sCount / tCount) * 100))
    : null;

  const daysLeft = endDate
    ? Math.max(
        0,
        Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      )
    : null;

  return (
    <div>
      {(sCount && (
        <div className="bg-gray-50 dark:bg-inherit border border-gray-200 dark:border-zinc-800 dark:border-zinc-800 px-3 py-1 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-2 font-sans text-gray-800 dark:text-white">
            Petition Stats
          </h2>
          <ul className="space-y-2">
            <li>
              <strong>Total Signatures:</strong> {sCount}
            </li>

            {tCount !== undefined && (
              <li>
                <strong>Target:</strong> {tCount}
              </li>
            )}

            {percentage !== null && showProgressBar && (
              <li>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {percentage}% of goal
                </div>
              </li>
            )}

            {endDate && (
              <li>
                <strong>Time Left:</strong>{" "}
                {daysLeft !== null
                  ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
                  : "N/A"}
              </li>
            )}

            {startDate && (
              <li>
                <strong>Started:</strong>{" "}
                {new Date(startDate).toLocaleDateString()}
              </li>
            )}
            {data.target && (
              <li>
                <strong>Decision Maker:</strong>
                {data.target.name}
              </li>
            )}
          </ul>
        </div>
      )) || (
        <div className="font-sans bg-blue-100 p-3">
          <h2 className="font-bold !text-blue-700/60 text-center text-xl">
            Be the first to sign!
          </h2>
        </div>
      )}
    </div>
  );
};

export default PetitionStats;
