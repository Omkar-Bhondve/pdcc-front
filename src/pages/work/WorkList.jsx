import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/ui/DataTable";
import { Switch } from "../../components/common/Switch";
import { PageHeader } from "../../components/common/PageHeader";
import { TableActions } from "../../components/common/TableActions";
import { PermissionGuard } from "../../components/auth/PermissionGuard";
import toast from "react-hot-toast";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { PERMISSIONS } from "../../config/permissions";
import api from "../../services/api";

const WorkList = () => {
  const navigate = useNavigate();
  const [work, setWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { handleError } = useErrorHandler();
  const [error, setError] = useState(null);

  const fetchWork = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/work', {
        params: { page, limit, search: searchQuery }
      });
      const workData = response.data.data.data || [];
      const paginationData = response.data.data.pagination || {};
      
      setWork(Array.isArray(workData) ? workData : []);
      setTotalPages(paginationData.totalPages || 1);
      setTotalItems(paginationData.total || 0);
    } catch (err) {
      console.error("Failed to fetch work", err);
      const msg = err.message || "Failed to load work";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchWork();
  }, [fetchWork]);

  const handleToggleStatus = async (item, checked) => {
    try {
      // Optimistic update
      setWork((prev) =>
        prev.map((w) =>
          w.work_id === item.work_id ? { ...w, status: checked ? 'active' : 'inactive' } : w,
        ),
      );

      await api.put(`/admin/work/${item.work_id}`, { status: checked ? 'active' : 'inactive' });
      toast.success(
        `Work ${checked ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      handleError(error, { showToast: true });
      // Revert on failure
      setWork((prev) =>
        prev.map((w) =>
          w.work_id === item.work_id ? { ...w, status: checked ? 'inactive' : 'active' } : w,
        ),
      );
    }
  };

  const handleDelete = async (items) => {
    try {
      const ids = items.map((item) => item.work_id);

      await Promise.all(ids.map((id) => api.delete(`/admin/work/${id}`)));

      toast.success("Work(s) deleted successfully");
      fetchWork();
    } catch (error) {
      handleError(error, { showToast: true });
    }
  };

  const columns = useMemo(
    () => [
      { key: "work_name", header: "Work Name", sortable: true },
      {
        key: "status",
        header: "Status",
        className: "text-center",
        render: (_, item) => (
          <div className="flex items-center justify-center gap-2">
            <PermissionGuard permissions={PERMISSIONS.WORK_EDIT}>
              <Switch
                checked={item.status === 'active'}
                onCheckedChange={(checked) => handleToggleStatus(item, checked)}
              />
            </PermissionGuard>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${item.status === 'active' ? "text-emerald-600" : "text-slate-400"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? "bg-emerald-500" : "bg-slate-300"}`}
              />
              {item.status === 'active' ? "Active" : "Inactive"}
            </span>
          </div>
        ),
      },
      {
        key: "created_by_name",
        header: "Created By",
        sortable: true,
        render: (_, item) => item.created_by_name || "-",
      },
      {
        key: "created_at",
        header: "Created At",
        sortable: true,
        render: (_, item) => new Date(item.created_at).toLocaleDateString(),
      },
      {
        key: "work_id",
        header: "Actions",
        className: "text-center",
        render: (_value, item, helpers) => (
          <TableActions
            onView={() => navigate(`/work/view/${item.work_id}`)}
            onEdit={() => navigate(`/work/edit/${item.work_id}`)}
            onDelete={() => helpers?.onDelete?.()}
            viewPermission={PERMISSIONS.WORK_VIEW}
            editPermission={PERMISSIONS.WORK_EDIT}
            deletePermission={PERMISSIONS.WORK_DELETE}
          />
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Management"
        description="Manage work types and their status"
        actionLabel="Add Work"
        onAction={() => navigate("/work/add")}
        permission={PERMISSIONS.WORK_CREATE}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={work}
        onSearch={setSearchQuery}
        onDelete={handleDelete}
        deletePermission={PERMISSIONS.WORK_DELETE}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          totalItems,
          onPageChange: setPage,
          pageSize: limit,
          onPageSizeChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          },
          pageSizeOptions: [10, 25, 50, 100],
        }}
        isLoading={loading}
        rowKey="work_id"
        headerClassName="bg-slate-900 text-white"
        showRowNumbers={true}
      />
    </div>
  );
};

export default WorkList;
