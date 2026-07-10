import React from "react";
import { Copy, RotateCcw, Monitor, Smartphone, Tablet } from "lucide-react";

export default function TemplateToolbar({ 
  onClone, 
  onReset, 
  currentViewport = "desktop", 
  onChangeViewport 
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between gap-4 text-xs font-medium text-gray-600 shadow-sm">
      {/* Structural layout commands */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClone}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-all cursor-pointer"
        >
          <Copy size={13} className="text-gray-400" />
          Clone Current Canvas Setup
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer"
        >
          <RotateCcw size={13} className="text-gray-400" />
          Reset to Baseline Defaults
        </button>
      </div>

      {/* Screen Breakpoint Simulation Control Toggles */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => onChangeViewport?.("desktop")}
          className={`p-1.5 rounded-md transition-all ${currentViewport === "desktop" ? "bg-white text-gray-800 shadow-xs" : "text-gray-400 hover:text-gray-600"}`}
          title="Desktop layout preset"
        >
          <Monitor size={14} />
        </button>
        <button
          type="button"
          onClick={() => onChangeViewport?.("tablet")}
          className={`p-1.5 rounded-md transition-all ${currentViewport === "tablet" ? "bg-white text-gray-800 shadow-xs" : "text-gray-400 hover:text-gray-600"}`}
          title="Tablet layout preset"
        >
          <Tablet size={14} />
        </button>
        <button
          type="button"
          onClick={() => onChangeViewport?.("mobile")}
          className={`p-1.5 rounded-md transition-all ${currentViewport === "mobile" ? "bg-white text-gray-800 shadow-xs" : "text-gray-400 hover:text-gray-600"}`}
          title="Mobile layout preset"
        >
          <Smartphone size={14} />
        </button>
      </div>
    </div>
  );
}