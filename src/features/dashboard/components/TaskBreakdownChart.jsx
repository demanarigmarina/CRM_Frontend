import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BaseCard from "../../../components/card/BaseCard";

const STATUS_COLORS = {
  "To Do": "#94a3b8",
  "In Progress": "#38bdf8",
  Completed: "#34d399",
};

const PRIORITY_COLORS = {
  Low: "#86efac",
  Medium: "#fbbf24",
  High: "#f87171",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-md shadow-md px-3 py-2 text-sm">
      <p className="font-medium text-gray-700">{name}</p>
      <p className="text-gray-500">
        {value} task{value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

function MiniPie({ title, data, colorMap }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-400 text-center mb-1">
        {title}
      </p>
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={32}
            outerRadius={52}
            paddingAngle={3}
            dataKey="value"
          >
            {(data ?? []).map((entry) => (
              <Cell key={entry.name} fill={colorMap[entry.name] ?? "#e2e8f0"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: 10 }}
            formatter={(value) => (
              <span className="text-gray-500">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function SkeletonPies() {
  return (
    <div className="flex gap-4">
      {[0, 1].map((i) => (
        <div key={i} className="flex-1 flex items-center justify-center h-36">
          <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function TaskBreakdownChart({ data, loading }) {
  return (
    <BaseCard>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
        Task Breakdown
      </p>
      <p className="text-sm text-gray-500 mb-3">By status & priority</p>

      {loading ? (
        <SkeletonPies />
      ) : (
        <div className="flex gap-2">
          <MiniPie
            title="By Status"
            data={data?.byStatus ?? []}
            colorMap={STATUS_COLORS}
          />
          <MiniPie
            title="By Priority"
            data={data?.byPriority ?? []}
            colorMap={PRIORITY_COLORS}
          />
        </div>
      )}
    </BaseCard>
  );
}
