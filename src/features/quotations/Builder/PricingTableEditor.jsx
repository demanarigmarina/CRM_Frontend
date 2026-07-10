import React from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { FormInput } from "../../../components/form/FormField";

export default function PricingTableEditor({ field, onUpdate }) {
  // Safe default initial columns if none exist yet
  const columns = field.columns || [
    { id: "col_1", label: "Item Description", type: "text" },
    { id: "col_2", label: "Quantity", type: "number" },
    { id: "col_3", label: "Unit Price", type: "currency" },
    { id: "col_4", label: "Total", type: "computed" }
  ];

  const handleAddColumn = () => {
    const newCol = {
      id: `col_${Date.now()}`,
      label: "Custom Column",
      type: "text"
    };
    onUpdate({ ...field, columns: [...columns, newCol] });
  };

  const handleUpdateColumn = (colId, updatedLabel) => {
    const updated = columns.map(c => c.id === colId ? { ...c, label: updatedLabel } : c);
    onUpdate({ ...field, columns: updated });
  };

  const handleRemoveColumn = (colId) => {
    // Keep at least one column to prevent UI breakage
    if (columns.length <= 1) return;
    onUpdate({ ...field, columns: columns.filter(c => c.id !== colId) });
  };

  return (
    <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
          [{field.type} Columns Config]
        </span>
        <button
          type="button"
          onClick={handleAddColumn}
          className="text-[11px] font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
        >
          <Plus size={12} /> Add Column
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {columns.map((col) => (
          <div 
            key={col.id} 
            className="bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-2 shadow-sm"
          >
            <GripVertical size={12} className="text-gray-300 shrink-0" />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={col.label}
                onChange={(e) => handleUpdateColumn(col.id, e.target.value)}
                className="text-xs font-medium text-gray-700 w-full focus:outline-none border-b border-transparent hover:border-gray-200 focus:border-red-500 pb-0.5"
              />
              <span className="text-[9px] text-gray-400 block uppercase tracking-tight mt-0.5">
                Type: {col.type}
              </span>
            </div>
            {col.type !== "computed" && (
              <button
                type="button"
                onClick={() => handleRemoveColumn(col.id)}
                className="text-gray-400 hover:text-red-500 p-0.5 transition-colors shrink-0"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}