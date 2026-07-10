import React, { useState } from "react";
import { Search, LayoutGrid, Plus } from "lucide-react";
import TemplateCard from "./TemplateCard";

export default function TemplateList({ templates = [], selectedId, onSelect, onPreview, onCreateCustom }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTemplates = templates.filter(t =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Structural Filter Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search layout blueprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-all shadow-xs"
          />
        </div>
        
        {onCreateCustom && (
          <button
            type="button"
            onClick={onCreateCustom}
            className="shrink-0 flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-xs cursor-pointer"
          >
            <Plus size={13} /> Custom Layout
          </button>
        )}
      </div>

      {/* Grid Canvas Wrapper context view layout */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id || template._id}
              template={template}
              isSelected={selectedId === (template.id || template._id)}
              onSelect={onSelect}
              onPreview={onPreview}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <LayoutGrid size={24} className="mx-auto text-gray-300 mb-2" />
          <p className="text-xs text-gray-500 font-medium">No layout structural blueprints match your query criteria.</p>
        </div>
      )}
    </div>
  );
}