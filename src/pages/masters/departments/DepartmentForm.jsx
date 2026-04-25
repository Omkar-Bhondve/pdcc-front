import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StandardForm from "../../../components/ui/StandardForm";
import { Input } from "../../../components/common/Input";
import { Switch } from "../../../components/common/Switch";
import { masterService } from "../../../services";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";

const departmentSchema = z.object({
  department_name: z.string().min(2, "Department name must be at least 2 characters"),
  department_code: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
});

const DepartmentForm = ({ isEdit = false, isView = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      department_name: '',
      department_code: '',
      is_active: true,
    },
  });

  // Load department data for edit/view
  useEffect(() => {
    if (isEdit || isView) {
      const loadDepartment = async () => {
        try {
          const data = await masterService.getDepartmentById(id);
          setInitialData(data);
          reset(data);
        } catch (error) {
          console.error("Failed to load department:", error);
          toast.error("Failed to load department");
          navigate("/masters/departments");
        }
      };

      loadDepartment();
    }
  }, [id, isEdit, isView, navigate, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await masterService.updateDepartment(id, data);
        toast.success("Department updated successfully");
      } else {
        await masterService.createDepartment(data);
        toast.success("Department created successfully");
      }
      navigate("/masters/departments");
    } catch (error) {
      console.error("Failed to save department:", error);
      toast.error(error.message || "Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardForm
      title="Department"
      icon={Building2}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => navigate("/masters/departments")}
      isEditMode={isEdit}
      isViewMode={isView}
      loading={loading}
    >
      <Input
          label="Department Name"
          placeholder="Enter department name"
          error={errors.department_name?.message}
          disabled={isView || loading}
          {...register("department_name")}
          leftIcon={<Building2 className="h-4 w-4" />}
        />

        <Input
          label="Department Code"
          placeholder="Enter department code (optional)"
          error={errors.department_code?.message}
          disabled={isView || loading}
          {...register("department_code")}
          leftIcon={<Building2 className="h-4 w-4" />}
        />

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold text-slate-700">Active Status</label>
            <p className="text-xs text-slate-500">Department is currently active</p>
          </div>
          <Switch
            checked={watch("is_active")}
            onCheckedChange={(checked) => setValue("is_active", checked)}
            disabled={isView || loading}
          />
        </div>
    </StandardForm>
  );
};

export default DepartmentForm;
