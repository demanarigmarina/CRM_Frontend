import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BaseCard from "../../../components/card/BaseCard";

const buildTooltip = (total) => {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    return (
      <div className="bg-white border border-gray-100 rounded-md shadow-md px-3 py-2 text-sm min-w-[140px]">
        <p className="font-semibold text-gray-700 mb-1">{name}</p>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-gray-500">Count</span>
          <span className="font-medium text-gray-700">{value}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-gray-500">Share</span>
          <span className="font-medium text-gray-700">{pct}%</span>
        </div>
      </div>
    );
  };
  CustomTooltip.displayName = "LeadSourceTooltip";
  return CustomTooltip;
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function SkeletonPie() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse" />
    </div>
  );
}

export default function LeadSourceChart({ data, loading }) {
  const total = useMemo(
    () => (data ?? []).reduce((sum, d) => sum + d.value, 0),
    [data],
  );

  const TooltipComponent = useMemo(() => buildTooltip(total), [total]);
  console.log(
    "LeadSourceChart data:",
    data?.map((d) => d.name),
  );

  const legendPayload = (data ?? []).map((entry) => ({
    value: entry.name,
    type: "circle",
    color: entry.color,
  }));

  console.log(
    "Legend payload order:",
    legendPayload.map((p) => p.value),
  );
  return (
    <BaseCard>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
        Lead Sources
      </p>
      <p className="text-sm text-gray-500 mb-3">
        Where leads come from
        {!loading && total > 0 && (
          <span className="ml-1 text-xs text-gray-400">({total} total)</span>
        )}
      </p>

      {loading ? (
        <SkeletonPie />
      ) : !data?.length || total === 0 ? (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          No lead source data
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                ))}
              </Pie>
              <Tooltip content={<TooltipComponent />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center">
            {data.map((entry) => (
              <span
                key={entry.name}
                className="flex items-center gap-1.5 text-xs text-gray-500"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
            ))}
          </div>
        </>
      )}
    </BaseCard>
  );
}
