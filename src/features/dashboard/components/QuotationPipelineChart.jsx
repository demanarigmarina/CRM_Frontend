import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BaseCard from "../../../components/card/BaseCard";

const formatValue = (v) => {
  if (v >= 1_000_000) return `₱${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `₱${(v / 1_000).toFixed(0)}K`;
  return `₱${v}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-md shadow-md px-3 py-2 text-sm min-w-37">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-4 text-xs"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-gray-500">{p.name}</span>
          </span>
          <span className="font-medium text-gray-700">
            {p.dataKey === "totalValue" ? formatValue(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

function SkeletonBars() {
  return (
    <div className="flex items-end gap-3 h-48 px-2">
      {[50, 70, 60, 40, 30, 20].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-100 rounded-t-sm animate-pulse"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export default function QuotationPipelineChart({ data, loading }) {
  const maxCount = Math.max(...(data ?? []).map((d) => d.count), 1);
  const maxValue = Math.max(...(data ?? []).map((d) => d.totalValue), 1);
  const countDomain = [0, Math.ceil(maxCount * 1.25)];
  const valueDomain = [0, Math.ceil(maxValue * 1.25)];

  return (
    <BaseCard>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Quotation Pipeline
          </p>
          <p className="text-sm text-gray-500">Count & value by stage</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-violet-400" />
            # Quotations (L)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-400" />
            Value (R)
          </span>
        </div>
      </div>

      {loading ? (
        <SkeletonBars />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart
            data={data}
            margin={{ top: 4, right: 48, left: -8, bottom: 0 }}
            barGap={4}
            barSize={18}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="count"
              orientation="left"
              allowDecimals={false}
              domain={countDomain}
              tick={{ fontSize: 10, fill: "#a78bfa" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />

            <YAxis
              yAxisId="value"
              orientation="right"
              tickFormatter={formatValue}
              domain={valueDomain}
              tick={{ fontSize: 10, fill: "#fbbf24" }}
              axisLine={false}
              tickLine={false}
              width={48}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />

            <Bar
              yAxisId="count"
              dataKey="count"
              name="# Quotations"
              fill="#a78bfa"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="value"
              dataKey="totalValue"
              name="Total Value"
              fill="#fbbf24"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </BaseCard>
  );
}
