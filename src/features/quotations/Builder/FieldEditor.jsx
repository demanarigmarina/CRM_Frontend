import React from "react";
import { Trash2 } from "lucide-react";
import { FormInput } from "../../../components/form/FormField";

export default function FieldEditor({ field, onUpdate, onRemove }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-2.5 transition-all hover:bg-gray-100/50">
      <div className="flex-1 grid grid-cols-3 gap-3 items-center">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
          [{field.type}]
        </span>
        <div className="col-span-2">
          <FormInput
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ ...field, label: e.target.value })}
            className="text-xs bg-white"
            placeholder="Field Label Title"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(field.id)}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}