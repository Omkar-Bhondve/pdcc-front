import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../../services";
import { masterService } from "../../../services";
import { PageHeader } from "../../../components/common/PageHeader";
import { DataTable } from "../../../components/ui/DataTable";
import { TableActions } from "../../../components/common/TableActions";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { PERMISSIONS } from "../../../config/permissions";

const DistrictList = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch districts from backend
  const loadDistricts = async () => {
    setLoading(true);
    try {
      const response = await masterService.getDistricts({ page, limit, search: searchQuery });
      // Handle both paginated response and direct array response
      if (Array.isArray(response)) {
        // Direct array response (no pagination)
        setDistricts(response);
        setTotalPages(1);
        setTotalItems(response.length);
      } else if (response.data && Array.isArray(response.data)) {
        // Paginated response with data.data structure
        setDistricts(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      } else {
        // Fallback for other response structures
        setDistricts([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      handleError(error, { showToast: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistricts();
  }, [page, limit, searchQuery, handleError]);

  // Delete district
  const handleDelete = async (items) => {
    try {
      const ids = items.map((item) => item.district_id);
      await Promise.all(ids.map((id) => masterService.deleteDistrict(id)));
      
      // Refresh data after successful deletion
      toast.success(`Deleted ${ids.length} district(s) successfully`);
      loadDistricts(); // Directly call refresh function
    } catch (error) {
      handleError(error, { showToast: true });
    }
  };

  // Columns definition
  const columns = useMemo(
    () => [
      { key: "district_name", header: "District Name" },
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
              navigate(`/masters/districts/view/${row.district_id}`)
            }
            onEdit={() =>
              navigate(`/masters/districts/edit/${row.district_id}`)
            }
            onDelete={() => helpers?.onDelete?.()}
            viewPermission={PERMISSIONS.DISTRICTS_VIEW}
            editPermission={PERMISSIONS.DISTRICTS_EDIT}
            deletePermission={PERMISSIONS.DISTRICTS_DELETE}
          />
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Districts"
        description="Manage districts"
        actionLabel="Add District"
        onAction={() => navigate("/masters/districts/add")}
        permission={PERMISSIONS.DISTRICTS_CREATE}
      />

      <DataTable
        columns={columns}
        data={districts}
        isLoading={loading}
        onSearch={setSearchQuery}
        onDelete={handleDelete}
        deletePermission={PERMISSIONS.DISTRICTS_DELETE}
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
        rowKey="district_id"
        showRowNumbers={true}
      />
    </div>
  );
};

export default DistrictList;
