import { ArrowLeft } from "lucide-react";
import { Button } from "./Button";

const FormLayout = ({
  title,
  icon: Icon,
  children,
  onSubmit,
  onCancel,
  isEditMode,
  isViewMode,
  loading,
}) => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={onCancel}
          leftIcon={<ArrowLeft className="h-5 w-5" />}
        />

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            {Icon && <Icon className="h-5 w-5 text-blue-500" />}
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            {isViewMode
              ? `View ${title}`
              : isEditMode
              ? `Edit ${title}`
              : `Add New ${title}`}
          </h1>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">

        {/* Top Dark Header */}
        <div className="px-6 py-4 bg-slate-700 text-white font-semibold uppercase text-sm">
          {title} Information
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-6">
            {children}
          </div>

          {!isViewMode && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                isLoading={loading}
              >
                {isEditMode ? `Update ${title}` : `Create ${title}`}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormLayout;