import React from "react";
import { Trash2, GripVertical } from "lucide-react";
import FieldEditor from "./FieldEditor";

export default function SectionEditor({ section, onUpdate, onRemove, onBlockDrop }) {
  const handleNameChange = (e) => {
    onUpdate({ ...section, name: e.target.value });
  };

  const handleFieldUpdate = (updatedField) => {
    const updatedFields = section.fields.map(f => f.id === updatedField.id ? updatedField : f);
    onUpdate({ ...section, fields: updatedFields });
  };

  const handleFieldRemove = (fieldId) => {
    onUpdate({ ...section, fields: section.fields.filter(f => f.id !== fieldId) });
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("text/plain");
        onBlockDrop(section.id, type);
      }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical size={14} className="text-gray-400 cursor-move" />
          <input
            type="text"
            value={section.name}
            onChange={handleNameChange}
            className="font-semibold text-sm text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-red-500 focus:outline-none px-1"
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(section.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="p-4 space-y-3 min-h-20 bg-white/50">
        {section.fields.map((field) => (
          <FieldEditor
            key={field.id}
            field={field}
            onUpdate={handleFieldUpdate}
            onRemove={handleFieldRemove}
          />
        ))}
        {section.fields.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-400 italic border-2 border-dashed border-gray-100 rounded-xl">
            Drag items from the left or drop modules here to build this block layout.
          </div>
        )}
      </div>
    </div>
  );
}