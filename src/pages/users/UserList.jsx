import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/ui/DataTable";
import { Switch } from "../../components/common/Switch";
import { PageHeader } from "../../components/common/PageHeader";
import { TableActions } from "../../components/common/TableActions";
import { userService } from "../../services";
import { PermissionGuard } from "../../components/auth/PermissionGuard";
import toast from "react-hot-toast";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { PERMISSIONS } from "../../config/permissions";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { handleError } = useErrorHandler();
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers({ page, limit, search: searchQuery });
      // API returns { data: [...], pagination: { ... } }
      const usersData = response.data.data || [];
      const paginationData = response.pagination || {};
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setTotalPages(paginationData.totalPages || 1);
      setTotalItems(paginationData.total || 0);
    } catch (err) {
      console.error("Failed to fetch users", err);
      const msg = err.message || "Failed to load users";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (user, checked) => {
    try {
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id ? { ...u, is_active: checked } : u,
        ),
      );

      await userService.updateUser(user.user_id, { is_active: checked });
      toast.success(
        `User ${checked ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      handleError(error, { showToast: true });
      // Revert on failure
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id ? { ...u, is_active: !checked } : u,
        ),
      );
    }
  };

  const handleDelete = async (items) => {
  try {
    const ids = items.map((item) => item.user_id);

    await Promise.all(ids.map((id) => userService.deleteUser(id)));

    toast.success("User(s) deleted successfully");
    fetchUsers();
  } catch (error) {
    handleError(error, { showToast: true });
  }
};

  const columns = useMemo(
    () => [
      { key: "full_name", header: "Name", sortable: true },
      { key: "email", header: "Email", sortable: true },
      {
        key: "role",
        header: "Role",
        sortable: true,
        render: (_, user) => user.role_name || "-",
      },
      {
        key: "is_active",
        header: "Status",
        className: "text-center",
        render: (_, user) => (
          <div className="flex items-center justify-center gap-2">
            <PermissionGuard permissions={PERMISSIONS.USERS_EDIT}>
              <Switch
                checked={user.is_active}
                onCheckedChange={(checked) => handleToggleActive(user, checked)}
              />
            </PermissionGuard>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${user.is_active ? "text-emerald-600" : "text-slate-400"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-slate-300"}`}
              />
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        ),
      },
      {
        key: "user_id",
        header: "Actions",
        className: "text-center",
        render: (_value, user, helpers) => (
          <TableActions
            onView={() => navigate(`/users/view/${user.user_id}`)}
            onEdit={() => navigate(`/users/edit/${user.user_id}`)}
            onDelete={() => helpers?.onDelete?.()}
            viewPermission={PERMISSIONS.USERS_VIEW}
            editPermission={PERMISSIONS.USERS_EDIT}
            deletePermission={PERMISSIONS.USERS_DELETE}
          />
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage system users and their roles"
        actionLabel="Add User"
        onAction={() => navigate("/users/add")}
        permission={PERMISSIONS.USERS_CREATE}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        onSearch={setSearchQuery}
        onDelete={handleDelete}
        deletePermission={PERMISSIONS.USERS_DELETE}
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
        rowKey="user_id"
        headerClassName="bg-slate-900 text-white"
        showRowNumbers={true}
      />
    </div>
  );
};

export default UserList;
