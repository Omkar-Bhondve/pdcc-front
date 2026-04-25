import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/common/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { api } from '../../services';
import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { PERMISSIONS } from '../../config/permissions';

const RoleList = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // server-side pagination + search state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchRoles = async (pageArg = page, pageSizeArg = pageSize, searchArg = search) => {
    setLoading(true);
    try {
      const response = await api.get('/admin/roles', { 
        params: {
          page: pageArg,
          limit: pageSizeArg,
          search: searchArg || undefined,
        }
      });

      const apiData = response.data.data.data;
      const pagination = response.data.pagination;

      // Transform roles data to match what DataTable expects
      const transformedRoles = apiData.map(role => ({
        role_id: role.role_id,
        role_name: role.role_name,
        role_code: role.role_name.toLowerCase(), // Generate code from name
        description: role.description || '',
        is_system_role: role.is_system_role,
        is_active: role.is_active,
        created_at: role.created_at,
        updated_at: role.updated_at,
        permission_count: role.permission_count,
        user_count: role.user_count,
      }));

      setRoles(transformedRoles);
      
      // Handle pagination from backend
      if (pagination) {
        setPageSize(pagination.limit || pageSizeArg);
        setTotalPages(pagination.totalPages || Math.ceil((pagination.total || 0) / pageSizeArg));
        setTotal(pagination.total || 0);
      } else {
        // Fallback to client-side pagination if backend doesn't provide pagination
        const totalCount = apiData.length;
        const calculatedTotalPages = Math.ceil(totalCount / pageSizeArg);
        setPageSize(pageSizeArg);
        setTotalPages(calculatedTotalPages);
        setTotal(totalCount);
        
        // Apply client-side pagination
        const startIndex = (pageArg - 1) * pageSizeArg;
        const endIndex = startIndex + pageSizeArg;
        const paginatedRoles = transformedRoles.slice(startIndex, endIndex);
        setRoles(paginatedRoles);
      }
    } catch (error) {
      console.error('Failed to fetch roles', error);
    } finally {
      setLoading(false);
    }
  };

  // initial load & reload on page / pageSize / search change
  React.useEffect(() => {
    fetchRoles(page, pageSize, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  const handleDelete = async (items) => {
    if (confirm(`Are you sure you want to delete ${items.length} roles?`)) {
      try {
        await Promise.all(items.map((r) => api.delete(`/admin/roles/${r.role_id}`)));
        // stay on same page after delete
        fetchRoles(page, pageSize, search);
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const handleSearch = useCallback((value) => {
    // Avoid resetting page if the search string hasn't changed (prevents flicker/reset)
    if (value === search) return;
    setPage(1);
    setSearch(value);
  }, [search]);

  const columns = useMemo(
    () => [
      { key: 'role_name', header: 'Role Name', sortable: true },
      { key: 'role_code', header: 'Code', sortable: true },
      { key: 'description', header: 'Description' },
      {
        key: 'role_id',
        header: 'Actions',
        className: 'text-center',
        render: (_, role) => (
          <div className="flex items-center justify-center gap-2">
            <PermissionGuard permissions={PERMISSIONS.ROLES_EDIT}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/roles/edit/${role.role_id}`)}
                className="text-blue-600 hover:text-blue-900"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGuard>
            <PermissionGuard permissions={PERMISSIONS.ROLES_DELETE}>
              {!role.is_system_role && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete([role])}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </PermissionGuard>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management"
        description="Manage roles and permissions"
        actionLabel="Add Role"
        onAction={() => navigate('/roles/add')}
        permission={PERMISSIONS.ROLES_CREATE}
      />

      <DataTable
        columns={columns}
        data={roles}
        isLoading={loading}
        onSearch={handleSearch}
        onDelete={handleDelete}
        deletePermission={PERMISSIONS.ROLES_DELETE}
        pagination={{
          currentPage: page,
          totalPages,
          pageSize,
          total,
          pageSizeOptions: [10, 20, 50],
          onPageChange: (newPage) => {
            setPage(newPage);
          },
          onPageSizeChange: (newSize) => {
            setPageSize(newSize);
            setPage(1); // reset to first page when page size changes
          },
        }}
        rowKey="role_id"
        headerClassName="bg-slate-900 text-white"
        showRowNumbers={true}
      />
    </div>
  );
};

export default RoleList;