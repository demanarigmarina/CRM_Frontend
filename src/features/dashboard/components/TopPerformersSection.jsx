import { Trophy } from "lucide-react";
import BaseCard from "../../../components/card/BaseCard";
import { getProfileImage } from "../../../utils/avatar";
import { getDisplayName } from "../../../utils/name";
import UserDisplayName from "../../../components/UserDisplayName";

const MEDAL = ["🥇", "🥈", "🥉"];

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-3 bg-gray-100 rounded animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="h-2 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-5 w-8 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function TopPerformersSection({ data, loading }) {
  if (!loading && data === null) return null;

  return (
    <BaseCard>
      <div className="flex items-center gap-2 mb-9">
        <Trophy size={14} className="text-gray-400" />
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Top Performers
        </p>
      </div>

      {loading ? (
        <SkeletonRows />
      ) : !data?.length ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No conversions yet
        </p>
      ) : (
        <div className="space-y-8">
          {data.map((performer, idx) => (
            <div key={performer.userId} className="flex items-center gap-3">
              {/* Rank */}
              <span className="text-sm w-5 text-center shrink-0">
                {idx < 3 ? (
                  MEDAL[idx]
                ) : (
                  <span className="text-gray-400 text-xs font-medium">
                    {idx + 1}
                  </span>
                )}
              </span>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={getProfileImage(performer)}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Name + Role + ID */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate leading-none">
                  <UserDisplayName user={performer} showYou={true}>
                    {getDisplayName(performer, {
                      includeMiddle: false,
                      includeSuffix: true,
                    })}
                  </UserDisplayName>{" "}
                  -{" "}
                  <span className="text-gray-400 truncate">
                    {performer.role}
                  </span>
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {performer.employeeId ?? performer.role}
                </p>
              </div>

              {/* Conversions badge */}
              <span
                title={`${performer.conversions} successful lead conversions`}
                className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shrink-0 cursor-help"
              >
                {performer.conversions}
              </span>
            </div>
          ))}
        </div>
      )}
    </BaseCard>
  );
}
