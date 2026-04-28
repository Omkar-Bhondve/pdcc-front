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
import { Mail, MailCheck, AlertCircle } from "lucide-react";

const ContractorList = () => {
  const navigate = useNavigate();
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");
  const { handleError } = useErrorHandler();
  const [error, setError] = useState(null);

  const fetchContractors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit, search: searchQuery };
      if (typeFilter !== "all") {
        params.contractor_type = typeFilter;
      }
      
      const response = await api.get('/admin/contractor', { params });
      const contractorData = response.data.data.data || [];
      const paginationData = response.data.data.pagination || {};
      
      setContractors(Array.isArray(contractorData) ? contractorData : []);
      setTotalPages(paginationData.totalPages || 1);
      setTotalItems(paginationData.total || 0);
    } catch (err) {
      console.error("Failed to fetch contractors", err);
      const msg = err.message || "Failed to load contractors";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, typeFilter]);

  useEffect(() => {
    fetchContractors();
  }, [fetchContractors]);


  const handleDelete = async (items) => {
    try {
      // Check if any contractor has credentials sent
      const contractorsWithCredentials = items.filter(item => item.email_sent);
      if (contractorsWithCredentials.length > 0) {
        const names = contractorsWithCredentials.map(item => 
          item.contractor_type === 'sube' 
            ? `${item.sube_first_name || ''} ${item.sube_last_name || ''}`.trim()
            : item.majur_society_name || 'Contractor'
        ).join(', ');
        
        toast.error(`Cannot delete contractors with active credentials: ${names}. Please deactivate them instead.`);
        return;
      }

      const ids = items.map((item) => item.contractor_id);

      await Promise.all(ids.map((id) => api.delete(`/admin/contractor/${id}`)));

      toast.success("Contractor(s) deleted successfully");
      fetchContractors();
    } catch (error) {
      handleError(error, { showToast: true });
    }
  };

  const handleSendCredentials = async (contractor) => {
    try {
      if (!contractor.email) {
        toast.error("This contractor doesn't have an email address");
        return;
      }

      // if (!contractor.role_id) {
      //   toast.error("Please assign a role to this contractor before sending credentials");
      //   return;
      // }

      if (contractor.email_sent) {
        toast.error("Credentials have already been sent to this contractor");
        return;
      }

      const response = await api.post(`/admin/contractor/${contractor.contractor_id}/send-credentials`);

      toast.success(`Login credentials sent to ${contractor.email}`);
      fetchContractors(); // Refresh to update email_sent status
    } catch (error) {
      handleError(error, { showToast: true });
    }
  };

  const columns = useMemo(
    () => [
      { 
        key: "contractor_type", 
        header: "Type", 
        sortable: true,
        render: (_, item) => (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            item.contractor_type === 'majur' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {item.contractor_type.toUpperCase()}
          </span>
        ),
      },
      { 
        key: "contractor_name", 
        header: "Name", 
        render: (_, item) => {
          if (item.contractor_type === 'sube') {
            const name = `${item.sube_first_name || ''} ${item.sube_last_name || ''}`.trim();
            return name || "-";
          } else {
            return item.majur_society_name || "-";
          }
        },
      },
      {
        key: "email",
        header: "Email",
        render: (_, item) => item.email || "-",
      },
      {
        key: "email_sent",
        header: "Credentials Status",
        render: (_, item) => {
          if (item.email_sent) {
            return (
              <div className="flex items-center gap-2 text-green-600">
                <MailCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Sent</span>
              </div>
            );
          } else {
            return (
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">Not Sent</span>
              </div>
            );
          }
        },
      },
      {
        key: "created_at",
        header: "Created At",
        sortable: true,
        render: (_, item) => new Date(item.created_at).toLocaleDateString(),
      },
      {
        key: "contractor_id",
        header: "Actions",
        className: "text-center",
        render: (_value, item, helpers) => (
          <div className="flex items-center justify-center gap-2">
            <TableActions
              onView={() => navigate(`/contractor/view/${item.contractor_id}`)}
              onEdit={() => navigate(`/contractor/edit/${item.contractor_id}`)}
              onDelete={() => helpers?.onDelete?.()}
              viewPermission={PERMISSIONS.CONTRACTOR_VIEW}
              editPermission={PERMISSIONS.CONTRACTOR_EDIT}
              deletePermission={PERMISSIONS.CONTRACTOR_DELETE}
              // Disable delete if credentials sent
              deleteDisabled={item.email_sent}
              deleteTooltip={item.email_sent ? "Cannot delete contractor with active credentials" : "Delete contractor"}
            />
            <PermissionGuard permissions={PERMISSIONS.CONTRACTOR_SEND_EMAIL}>
              <button
                onClick={() => handleSendCredentials(item)}
                className={`p-1.5 rounded-md transition-colors ${
                  item.email_sent 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                title={item.email_sent ? "Credentials already sent" : "Send Login Credentials"}
                disabled={item.email_sent}
              >
                {item.email_sent ? <MailCheck className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              </button>
            </PermissionGuard>
          </div>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contractor Management"
        description="Manage contractors (Majur and Sube types)"
        actionLabel="Add Contractor"
        onAction={() => navigate("/contractor/add")}
        permission={PERMISSIONS.CONTRACTOR_CREATE}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Type Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter("majur")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "majur"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Majur
            </button>
            <button
              onClick={() => setTypeFilter("sube")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "sube"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sube
            </button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contractors}
        onSearch={setSearchQuery}
        onDelete={handleDelete}
        deletePermission={PERMISSIONS.CONTRACTOR_DELETE}
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
        rowKey="contractor_id"
        headerClassName="bg-slate-900 text-white"
        showRowNumbers={true}
      />
    </div>
  );
};

export default ContractorList;
