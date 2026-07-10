import React from "react";
import { X, Layout, Layers, HelpCircle } from "lucide-react";

export default function TemplatePreview({ template, onClose, onSelect }) {
  if (!template) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col h-full max-h-150">
      {/* Header element bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout size={16} className="text-red-500" />
          <div>
            <h3 className="text-sm font-bold text-gray-800">{template.name} Blueprint</h3>
            <p className="text-[11px] text-gray-400">Layout Preview Profile Mode</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md">
          <X size={16} />
        </button>
      </div>

      {/* Internal preview dynamic container tracking elements loop */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 space-y-4">
        {template.sections && template.sections.length > 0 ? (
          template.sections.map((section, sIdx) => (
            <div key={section.id || sIdx} className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2 mb-3">
                <Layers size={12} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{section.name}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {section.fields?.map((field, fIdx) => (
                  <div key={field.id || fIdx} className="p-2 bg-gray-50 border border-gray-100 rounded-md text-xs flex flex-col justify-center min-h-11">
                    <span className="text-gray-400 text-[10px] uppercase font-mono tracking-tighter">[{field.type}]</span>
                    <span className="text-gray-700 font-medium">{field.label}</span>
                  </div>
                ))}
                {(!section.fields || section.fields.length === 0) && (
                  <span className="text-[11px] text-gray-400 italic col-span-2">No workspace fields populated inside this layout section.</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-xs text-gray-400 italic">
            This workspace structure is currently clean and empty.
          </div>
        )}
      </div>

      {/* Primary baseline footer trigger action controls block */}
      <div className="p-3 bg-white border-t border-gray-100 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Dismiss Preview
        </button>
        <button
          type="button"
          onClick={() => {
            onSelect?.(template.id || template._id);
            onClose();
          }}
          className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-xs font-medium"
        >
          Apply Layout Framework
        </button>
      </div>
    </div>
  );
}