import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../../components/ui/DataTable";
import { PageHeader } from "../../../components/common/PageHeader";
import { TableActions } from "../../../components/common/TableActions";
import { PermissionGuard } from "../../../components/auth/PermissionGuard";
import { masterService } from "../../../services";
import toast from "react-hot-toast";
import { PERMISSIONS } from "../../../config/permissions";

const DepartmentList = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch departments from backend
  const loadDepartments = async () => {
    setLoading(true);
    try {
      const response = await masterService.getDepartments({ page, limit, search: searchQuery });
      // Handle both paginated response and direct array response
      if (Array.isArray(response)) {
        // Direct array response (no pagination)
        setDepartments(response);
        setTotalPages(1);
        setTotalItems(response.length);
      } else if (response.data && Array.isArray(response.data)) {
        // Paginated response with data.data structure
        setDepartments(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      } else {
        // Fallback for other response structures
        setDepartments([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, [page, limit, searchQuery]);

  // Delete department
  const handleDelete = async (items) => {
    try {
      const ids = items.map((item) => item.department_id);
      await Promise.all(ids.map((id) => masterService.deleteDepartment(id)));
      
      toast.success("Department(s) deleted successfully");
      loadDepartments(); // Directly call refresh function
    } catch (error) {
      console.error("Failed to delete departments:", error);
      toast.error("Failed to delete departments");
    }
  };

  // Columns definition
  const columns = useMemo(
    () => [
      { key: "department_name", header: "Department Name" },
      {
        key: "is_active",
        header: "Status",
        render: (_, row) => (
          <span
            className={`px-2 py-1 text-xs rounded ${
              row.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.is_active ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (_value, row, helpers) => (
          <TableActions
            onView={() =>
              navigate(`/masters/departments/view/${row.department_id}`)
            }
            onEdit={() =>
              navigate(`/masters/departments/edit/${row.department_id}`)
            }
            onDelete={() => helpers?.onDelete?.()}
            viewPermission={PERMISSIONS.DEPARTMENTS_VIEW}
            editPermission={PERMISSIONS.DEPARTMENTS_EDIT}
            deletePermission={PERMISSIONS.DEPARTMENTS_DELETE}
          />
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage departments"
        actionLabel="Add Department"
        onAction={() => navigate("/masters/departments/add")}
        permission={PERMISSIONS.DEPARTMENTS_CREATE}
      />

      <DataTable
        columns={columns}
        data={departments}
        isLoading={loading}
        onSearch={setSearchQuery}
        onDelete={handleDelete}
        deletePermission={PERMISSIONS.DEPARTMENTS_DELETE}
        pagination={{
          currentPage: page,
          totalPages,
          pageSize: limit,
          total: totalItems,
          onPageChange: setPage,
          onPageSizeChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1);
          },
          pageSizeOptions: [10, 25, 50, 100]
        }}
        rowKey="department_id"
        showRowNumbers={true}
      />
    </div>
  );
};

export default DepartmentList;
