import { Activity } from "lucide-react";
import BaseCard from "../../../components/card/BaseCard";
import { formatRelativeTime } from "../../../utils/date";

// Action → readable label + color dot
const ACTION_META = {
  CREATE: { label: "Created", color: "bg-sky-400" },
  UPDATE: { label: "Updated", color: "bg-amber-400" },
  DELETE: { label: "Deleted", color: "bg-red-400" },
  ASSIGN: { label: "Assigned", color: "bg-purple-400" },
  STATUS_CHANGE: { label: "Status changed", color: "bg-blue-400" },
  STAGE_CHANGE: { label: "Stage changed", color: "bg-indigo-400" },
  CONVERT: { label: "Converted", color: "bg-emerald-400" },
  CONVERSION_REQUESTED: {
    label: "Conversion requested",
    color: "bg-orange-400",
  },
  CONVERSION_APPROVED: { label: "Conversion approved", color: "bg-green-400" },
  NOTE: { label: "Note added", color: "bg-gray-400" },
};

function SkeletonRows() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="w-2 h-2 rounded-full bg-gray-100 animate-pulse mt-1.5 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="h-2 w-28 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-2 w-10 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function RecentActivitySection({ data, loading }) {
  return (
    <BaseCard>
      <div className="flex items-center gap-2 mb-4">
        <Activity size={14} className="text-gray-400" />
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Recent Activity
        </p>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : !data?.length ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No recent activity
        </p>
      ) : (
        <div className="">
          {data.map((activity) => {
            const meta = ACTION_META[activity.action] ?? {
              label: activity.action,
              color: "bg-gray-300",
            };
            const actor = activity.createdBy;
            const actorName = actor
              ? `${actor.firstName} ${actor.lastName}`
              : "System";

            return (
              <div
                key={activity._id}
                className="flex gap-3 items-start py-4 border-b-1 border-gray-300"
              >
                {/* Timeline dot */}
                <span
                  className={`w-2 h-2 rounded-full ${meta.color} mt-1.5 shrink-0`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">
                    <span className="font-medium">{actorName}</span> -{" "}
                    {activity.title && (
                      <span className="text-gray-400 truncate">
                        {activity.title}
                      </span>
                    )}
                  </p>
                </div>

                {/* Timestamp */}
                <span className="text-xs text-gray-400 shrink-0 mt-0.5">
                  {formatRelativeTime(
                    activity.activityDate ?? activity.createdAt,
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </BaseCard>
  );
}
