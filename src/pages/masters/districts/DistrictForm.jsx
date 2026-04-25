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
import { MapPin } from "lucide-react";
import { useErrorHandler } from "../../../hooks/useErrorHandler";

const districtSchema = z.object({
  district_name: z.string().min(2, "District name must be at least 2 characters"),
  district_code: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
});

const DistrictForm = ({ isEdit = false, isView = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const { handleError, getFieldError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      district_name: '',
      district_code: '',
      is_active: true,
    },
  });

  // Load district data for edit/view
  useEffect(() => {
    if (isEdit || isView) {
      const loadDistrict = async () => {
        if (!id) return;
        setLoading(true);
        try {
          const data = await masterService.getDistrictById(id);
          setInitialData(data);
          reset(data);
        } catch (error) {
          handleError(error, { showToast: true });
          navigate("/masters/districts");
        } finally {
          setLoading(false);
        }
      };

      loadDistrict();
    }
  }, [id, isEdit, isView, navigate, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await masterService.updateDistrict(id, data);
        toast.success("District updated successfully");
      } else {
        await masterService.createDistrict(data);
        toast.success("District created successfully");
      }
      navigate("/masters/districts");
    } catch (error) {
      handleError(error, { showToast: true, setFormErrors: true });
    } finally {
      setLoading(false);
    }
  };

  // Use simple children approach like UserForm

  return (
    <StandardForm
      title="District"
      icon={MapPin}
      onSubmit={handleSubmit(onSubmit)}
      onCancel={() => navigate("/masters/districts")}
      isEditMode={isEdit}
      isViewMode={isView}
      loading={loading}
    >
      <Input
          label="District Name"
          placeholder="Enter district name"
          error={errors.district_name?.message}
          disabled={isView || loading}
          {...register("district_name")}
          leftIcon={<MapPin className="h-4 w-4" />}
        />

        <Input
          label="District Code"
          placeholder="Enter district code (optional)"
          error={errors.district_code?.message}
          disabled={isView || loading}
          {...register("district_code")}
          leftIcon={<MapPin className="h-4 w-4" />}
        />

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold text-slate-700">Active Status</label>
            <p className="text-xs text-slate-500">District is currently active</p>
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

export default DistrictForm;
