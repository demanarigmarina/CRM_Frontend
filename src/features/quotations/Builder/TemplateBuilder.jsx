import React, { useState } from "react";
import { Plus, LayoutGrid, X, Save } from "lucide-react";
import { AVAILABLE_BLOCKS } from "../utils/templateDefaults";
import SectionEditor from "./SectionEditor";

export default function TemplateBuilder({ template, onSave, onCancel }) {
  const [templateName, setTemplateName] = useState(template?.name || "My Custom Template");
  const [sections, setSections] = useState(template?.sections || []);

  const handleAddSection = () => {
    const newSec = {
      id: `sec_${Date.now()}`,
      name: `Section Block ${sections.length + 1}`,
      fields: []
    };
    setSections([...sections, newSec]);
  };

  const handleUpdateSection = (updatedSec) => {
    setSections(sections.map(s => s.id === updatedSec.id ? updatedSec : s));
  };

  const handleRemoveSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleBlockDrop = (sectionId, blockType) => {
    const targetBlock = AVAILABLE_BLOCKS.find(b => b.type === blockType);
    if (!targetBlock) return;

    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        fields: [...s.fields, { id: `f_${Date.now()}`, type: blockType, label: targetBlock.label }]
      };
    }));
  };

  return (
    <div className="flex h-full min-h-[80vh] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      {/* Left Sidebar: Available drag blocks */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reusable Layout Blocks</h3>
          <p className="text-[11px] text-gray-400">Drag or click to insert into form sections</p>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {AVAILABLE_BLOCKS.map(block => (
            <div
              key={block.type}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", block.type)}
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-red-400 hover:bg-red-50/20 transition-all cursor-grab active:cursor-grabbing flex items-center gap-2"
            >
              <LayoutGrid size={12} className="text-gray-400" />
              {block.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas Workspace Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50">
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="text-base font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-red-500 focus:outline-none transition-all px-1"
          />
          <div className="flex items-center gap-2">
            <button onClick={onCancel} className="p-2 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 flex items-center gap-1"><X size={14} /> Cancel</button>
            <button onClick={() => onSave({ ...template, name: templateName, sections })} className="p-2 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1 shadow-sm"><Save size={14} /> Save Template</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto">
          {sections.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              onUpdate={handleUpdateSection}
              onRemove={handleRemoveSection}
              onBlockDrop={handleBlockDrop}
            />
          ))}

          <button
            type="button"
            onClick={handleAddSection}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 hover:border-red-500 hover:text-red-500 transition-all bg-white shadow-sm"
          >
            <Plus size={14} /> Add New Layout Section Container
          </button>
        </div>
      </div>
    </div>
  );
}