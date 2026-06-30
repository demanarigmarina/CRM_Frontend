import { DotLoader } from "react-spinners";

/**
 *
 * @param {{
 *   open: boolean,
 *   title: string,
 *   formId: string,
 *   loading: boolean,
 *   onClose: () => void,
 *   onCancel: () => void,
 *   children: React.ReactNode,
 * }} props
 */
export default function FormDrawer({
  open,
  title,
  formId,
  loading,
  onClose,
  onCancel,
  children,
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[630px] bg-white shadow-xl z-50
          flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>

        {/* Scrollable body — caller provides the <form> + fields */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50
                       text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            disabled={loading}
            className="relative px-5 py-2 bg-red-500 text-white text-sm rounded-md
                       hover:bg-red-600 disabled:opacity-70 transition-colors
                       min-w-[90px] cursor-pointer"
          >
            <span className={loading ? "opacity-0" : "opacity-100"}>
              Confirm
            </span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <DotLoader color="white" size={18} />
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
