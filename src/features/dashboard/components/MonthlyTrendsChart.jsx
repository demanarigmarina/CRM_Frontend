import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BaseCard from "../../../components/card/BaseCard";

const RANGES = [
  { label: "3m", months: 3, days: null },
  { label: "6m", months: 6, days: null },
];

const parseLabelToDate = (label) => new Date(label);

const mergeMonthlyData = (monthlyLeads = [], monthlyClients = []) => {
  const map = new Map();
  monthlyLeads.forEach(({ month, leads }) => {
    map.set(month, { month, leads, clients: 0 });
  });
  monthlyClients.forEach(({ month, clients }) => {
    if (map.has(month)) map.get(month).clients = clients;
    else map.set(month, { month, leads: 0, clients });
  });
  return Array.from(map.values());
};

const filterByRange = (data, range) => {
  const now = new Date();
  const cutoff = new Date(now);

  if (range.days) {
    cutoff.setDate(now.getDate() - range.days);
  } else if (range.months) {
    cutoff.setMonth(now.getMonth() - range.months);
  }

  return data.filter((row) => parseLabelToDate(row.month) >= cutoff);
};

//  Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-md shadow-md px-3 py-2 text-sm min-w-35">
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
          <span className="font-medium text-gray-700">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

function SkeletonLine() {
  return (
    <div className="space-y-3 h-48 flex flex-col justify-center px-4">
      {[55, 70, 40, 80, 60, 75].map((w, i) => (
        <div
          key={i}
          className="h-1 bg-gray-100 rounded-full animate-pulse"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export default function MonthlyTrendsChart({
  monthlyLeads,
  monthlyClients,
  loading,
}) {
  const [activeRange, setActiveRange] = useState(RANGES[1]); // default: 6m

  const allData = useMemo(
    () => mergeMonthlyData(monthlyLeads, monthlyClients),
    [monthlyLeads, monthlyClients],
  );

  const visibleData = useMemo(
    () => filterByRange(allData, activeRange),
    [allData, activeRange],
  );

  const isEmpty =
    !loading && visibleData.every((r) => r.leads === 0 && r.clients === 0);

  return (
    <BaseCard>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Monthly Trends
          </p>
          <p className="text-sm text-gray-500">Leads & clients over time</p>
        </div>

        <div className="flex items-center bg-gray-100 rounded-md p-0.5 gap-0.5">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setActiveRange(r)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                activeRange.label === r.label
                  ? "bg-white text-gray-700 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonLine />
      ) : isEmpty ? (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          No activity in this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={visibleData}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />
            <XAxis
              dataKey="month"
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
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => (
                <span className="text-gray-500">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{ r: 3, fill: "#38bdf8" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="clients"
              name="Clients"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ r: 3, fill: "#34d399" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </BaseCard>
  );
}
