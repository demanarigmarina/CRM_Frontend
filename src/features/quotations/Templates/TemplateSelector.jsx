import React, { useState } from "react";
import TemplateList from "./TemplateList";
import TemplatePreview from "./TemplatePreview";

export default function TemplateSelector({ templates = [], selectedId, onSelect, onCreateCustom }) {
  const [previewTarget, setPreviewTarget] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left side list control grid */}
      <div className={previewTarget ? "lg:col-span-2 space-y-4" : "lg:col-span-3 space-y-4"}>
        <div>
          <h2 className="text-base font-bold text-gray-800">Select Document Blueprint Template</h2>
          <p className="text-xs text-gray-400 mt-0.5">Choose an optimized dynamic workspace setup or build a custom form schema.</p>
        </div>
        
        <TemplateList
          templates={templates}
          selectedId={selectedId}
          onSelect={onSelect}
          onPreview={(tpl) => setPreviewTarget(tpl)}
          onCreateCustom={onCreateCustom}
        />
      </div>

      {/* Right sticky frame active viewport quick component selector panel */}
      {previewTarget && (
        <div className="lg:col-span-1 lg:sticky lg:top-4 transition-all duration-200">
          <TemplatePreview
            template={previewTarget}
            onClose={() => setPreviewTarget(null)}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
}