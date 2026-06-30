import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import BaseCard from "../../../components/card/BaseCard";

// Color per lead stage — matches your status badge colors
const STAGE_COLORS = {
  New: "#38bdf8", // sky
  Contacted: "#a78bfa", // purple
  Qualified: "#34d399", // emerald
  Converted: "#10b981", // green
  Lost: "#f87171", // red
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-md shadow-md px-3 py-2 text-sm">
      <p className="font-medium text-gray-700">{label}</p>
      <p className="text-gray-500">
        {payload[0].value} lead{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

// Skeleton bars while loading
function SkeletonBars() {
  return (
    <div className="flex items-end gap-3 h-44 px-2">
      {[60, 85, 45, 30, 20].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-100 rounded-t-sm animate-pulse"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export default function LeadFunnelChart({ data, loading }) {
  return (
    <BaseCard>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
        Lead Funnel
      </p>
      <p className="text-sm text-gray-500 mb-4">Leads by stage</p>

      {loading ? (
        <SkeletonBars />
      ) : (
        <ResponsiveContainer width="100%" height={176}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barSize={32}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {(data ?? []).map((entry) => (
                <Cell
                  key={entry.stage}
                  fill={STAGE_COLORS[entry.stage] ?? "#94a3b8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </BaseCard>
  );
}
