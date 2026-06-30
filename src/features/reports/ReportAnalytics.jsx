import { CheckCircle, AlertCircle, ListTodo } from "lucide-react";
import StatCard from "../../components/card/StatCard";

export default function ReportAnalytics() {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-left mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-sm text-gray-500">Overview of task assignments and performance metrics</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<CheckCircle size={20} />}
          label="Task Completion Rate"
          value="67%"
          color="emerald"
          sub="Based on completed tasks"
        />
        <StatCard
          icon={<AlertCircle size={20} />}
          label="Overdue Tasks"
          value="2"
          color="red"
          sub="Tasks past deadline"
        />
        <StatCard
          icon={<ListTodo size={20} />}
          label="Total Tasks"
          value="6"
          color="sky"
          sub="All task assignments"
        />
      </div>
    </div>
  );
}
