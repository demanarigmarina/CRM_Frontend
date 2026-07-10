import React from "react";
import { Layers, FileText, ChevronRight } from "lucide-react";
import BaseBadge from "../../../components/badge/BaseBadge";

export default function TemplateCard({ template, isSelected, onSelect, onPreview }) {
  const IconComponent = template.icon || FileText;
  const sectionCount = template.sections?.length || 0;

  return (
    <div
      onClick={() => onSelect?.(template.id || template._id)}
      className={`group p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-35 relative overflow-hidden ${
        isSelected ? "border-red-500 ring-2 ring-red-500/10" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className={`p-2 rounded-lg transition-colors ${isSelected ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"}`}>
            <IconComponent size={18} />
          </div>
          <BaseBadge tone={sectionCount > 0 ? "gray" : "amber"} shape="pill">
            {sectionCount} {sectionCount === 1 ? "Section" : "Sections"}
          </BaseBadge>
        </div>

        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-red-500 transition-colors line-clamp-1">
          {template.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {template.description || "Custom user configuration layout framework template blueprint."}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] font-medium">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview?.(template);
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          Quick Preview
        </button>
        <span className={`flex items-center gap-0.5 transition-transform group-hover:translate-x-0.5 ${isSelected ? "text-red-500" : "text-gray-400"}`}>
          Use Layout <ChevronRight size={12} />
        </span>
      </div>
    </div>
  );
}