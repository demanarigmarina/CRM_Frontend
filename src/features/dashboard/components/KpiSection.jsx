import {
  Users,
  Magnet,
  UserCheck,
  TrendingUp,
  DollarSign,
  CheckSquare,
  ListTodo,
  Target,
} from "lucide-react";
import StatCard from "../../../components/card/StatCard";

// Format PHP currency compactly: 1,200,000 → ₱1.2M
const formatCurrency = (value) => {
  if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₱${(value / 1_000).toFixed(1)}K`;
  return `₱${value.toLocaleString()}`;
};

export default function KpiSection({ kpi, loading }) {
  const cards = [
    {
      icon: <Magnet size={23} />,
      label: "Total Leads",
      tooltip: "Total number of leads in the system",
      value: loading ? null : kpi?.leads.total,
      sub: loading ? null : `+${kpi?.leads.newThisMonth ?? 0} this month`,
      color: "sky",
    },
    {
      icon: <UserCheck size={23} />,
      label: "Total Customers",
      tooltip: "Total number of customers",
      value: loading ? null : kpi?.customers.total,
      sub: loading
        ? null
        : `${kpi?.customers.active ?? 0} active · +${kpi?.customers.newThisMonth ?? 0} this month`,
      color: "emerald",
    },
    {
      icon: <Target size={23} />,
      label: "Lead Conversion",
      tooltip: "Percentage of leads that have been converted to customers",
      value: loading ? null : `${kpi?.leads.conversionRate ?? 0}`,
      sub: loading
        ? null
        : `${kpi?.leads.converted ?? 0} converted · ${kpi?.leads.lost ?? 0} lost`,
      color: "purple",
    },
    {
      icon: <DollarSign size={23} />,
      label: "Open Deal Value",
      tooltip: "Total value of all open deals",
      value: loading ? null : formatCurrency(kpi?.deals.openValue ?? 0),
      sub: loading
        ? null
        : `${kpi?.deals.total ?? 0} deals · ${kpi?.deals.winRate ?? 0}% win rate`,
      color: "amber",
    },
    {
      icon: <ListTodo size={23} />,
      label: "Total Tasks",
      tooltip: "Total number of tasks",
      value: loading ? null : kpi?.tasks.total,
      sub: loading
        ? null
        : `${kpi?.tasks.overdue ?? 0} overdue · ${kpi?.tasks.dueToday ?? 0} due today`,
      color: "red",
    },
    {
      icon: <CheckSquare size={23} />,
      label: "Task Completion",
      tooltip: "Percentage of tasks completed",
      value: loading ? null : `${kpi?.tasks.completionRate ?? 0}`,
      sub: loading
        ? null
        : `${kpi?.tasks.completed ?? 0} of ${kpi?.tasks.total ?? 0} completed`,
      color: "emerald",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} loading={loading} />
      ))}
    </div>
  );
}
