import React, { useState, useRef } from "react";
import { ArrowDown, ArrowUp, Search, Trash2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Pagination } from "../common/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import { ConfirmationModal } from "../common/ConfirmationModal";

export function DataTable({
  columns,
  data,
  isLoading,
  onSearch,
  onSort,
  onDelete,
  deletePermission,
  onSelectionChange,
  pagination,
  rowKey = "id",
  selectionResetKey,
  headerClassName,
  enableSelection = true,
  showRowNumbers = false,
  rowNumberHeader = "Sr No.",
  extraHeaderContent,
  rowClassName = "",
}) {
  const { hasPermission } = useAuth();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortConfig, setSortConfig] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemsPendingDelete, setItemsPendingDelete] = useState([]);
  const hasSentInitialSearch = useRef(false);

  const tableData = Array.isArray(data) ? data : [];
  const canDelete = deletePermission ? hasPermission(deletePermission) : true;
  const debouncedSearch = useDebounce(pendingSearch, 300);

  React.useEffect(() => {
    if (!onSearch) return;
    if (!hasSentInitialSearch.current) {
      hasSentInitialSearch.current = true;
      return;
    }
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  React.useEffect(() => {
    if (enableSelection && onSelectionChange) {
      const selectedList = tableData.filter((item) =>
        selectedItems.has(String(item[rowKey]))
      );
      onSelectionChange(selectedList);
    }
  }, [enableSelection, selectedItems, onSelectionChange]);

  React.useEffect(() => {
    if (selectionResetKey !== undefined) {
      setSelectedItems(new Set());
    }
  }, [selectionResetKey]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    if (onSort) onSort(key, direction);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(new Set(tableData.map((item) => String(item[rowKey]))));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectOne = (id) => {
    const newSelected = new Set(selectedItems);
    const strId = String(id);
    if (newSelected.has(strId)) {
      newSelected.delete(strId);
    } else {
      newSelected.add(strId);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteClick = (items) => {
    setItemsPendingDelete(Array.isArray(items) ? items : [items]);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (onDelete && itemsPendingDelete.length > 0) {
      await onDelete(itemsPendingDelete);
      setSelectedItems(new Set());
      setItemsPendingDelete([]);
    }
    setShowDeleteModal(false);
  };

  const leadingColumnCount = (enableSelection ? 1 : 0) + (showRowNumbers ? 1 : 0);
  const totalColumnCount = columns.length + leadingColumnCount;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg shadow-slate-200/60 bg-white">

      {/* ── Toolbar ── */}
      <div className="px-5 py-4 flex flex-col sm:flex-row justify-between gap-3 sm:items-center bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            placeholder="Search records..."
            value={pendingSearch}
            onChange={(e) => {
              setPendingSearch(e.target.value);
              if (pagination?.onPageChange) pagination.onPageChange(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2.5 justify-between sm:justify-end flex-wrap">
          {extraHeaderContent}
          {enableSelection && selectedItems.size > 0 && canDelete && onDelete && (
            <button
              onClick={() =>
                handleDeleteClick(
                  tableData.filter((item) => selectedItems.has(String(item[rowKey])))
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-all shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setItemsPendingDelete([]); }}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${itemsPendingDelete.length} item(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="min-w-full">

          {/* Header */}
          <thead>
            <tr className="bg-slate-900 border-b border-white/5">
              {enableSelection && (
                <th scope="col" className="px-5 py-4 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/30 cursor-pointer w-4 h-4 accent-blue-500"
                    onChange={handleSelectAll}
                    checked={tableData.length > 0 && selectedItems.size === tableData.length}
                  />
                </th>
              )}

              {showRowNumbers && (
                <th scope="col" className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  {rowNumberHeader}
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={cn(
                    "px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-400 select-none transition-colors group",
                    column.sortable && "cursor-pointer hover:text-white",
                    column.className
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-1.5",
                    column.className?.includes("text-center") && "justify-center",
                    column.className?.includes("text-right") && "justify-end"
                  )}>
                    {column.header}
                    {sortConfig?.key === column.key ? (
                      sortConfig.direction === "asc"
                        ? <ArrowUp className="h-3 w-3 text-blue-400" />
                        : <ArrowDown className="h-3 w-3 text-blue-400" />
                    ) : (
                      column.sortable && (
                        <ArrowUp className="h-3 w-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={totalColumnCount} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    {/* Animated spinner with glow */}
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
                      <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 animate-spin" />
                      <div className="absolute inset-1.5 rounded-full bg-blue-50 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-400 tracking-wide">Loading records…</p>
                  </div>
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={totalColumnCount} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                      <Search className="h-6 w-6 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">No records found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              tableData.map((item, index) => {
                if (!item) return null;
                const safeItem = item || {};
                const itemId = String(safeItem[rowKey]);
                const isSelected = selectedItems.has(itemId);
                return (
                  <tr
                    key={itemId || `row-${index}`}
                    className={cn(
                      "transition-colors duration-100 group",
                      isSelected
                        ? "bg-blue-50/70"
                        : index % 2 === 0
                          ? "bg-white hover:bg-slate-50/80"
                          : "bg-slate-50/30 hover:bg-slate-50/80",
                      rowClassName
                    )}
                  >
                    {enableSelection && (
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer w-4 h-4 accent-blue-500"
                          checked={isSelected}
                          onChange={() => handleSelectOne(itemId)}
                        />
                      </td>
                    )}

                    {showRowNumbers && (
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-[11px] font-bold text-slate-500 tabular-nums">
                          {pagination
                            ? (pagination.currentPage - 1) * pagination.pageSize + index + 1
                            : index + 1}
                        </span>
                      </td>
                    )}

                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          "px-5 py-3.5 text-sm text-slate-700 align-middle",
                          column.className,
                          column.className?.includes("text-right") && "text-right",
                          column.className?.includes("text-center") && "text-center"
                        )}
                      >
                        {column.render
                          ? column.render(safeItem[column.key], safeItem, {
                              onDelete: () => handleDeleteClick(safeItem),
                            })
                          : safeItem[column.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Footer ── */}
      {pagination && (
        <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-3.5 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-xs text-slate-500 w-full sm:w-auto font-medium">
            {pagination.pageSizeOptions && pagination.onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 whitespace-nowrap">Rows per page</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer hover:border-slate-300 transition-all shadow-sm"
                >
                  {pagination.pageSizeOptions.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            <span className="text-slate-400">
              {(() => {
                const pageSize = pagination.pageSize || tableData.length || 0;
                const currentPage = pagination.currentPage || 1;
                let totalCount = pagination.totalItems ?? pagination.total;
                if (totalCount === undefined) {
                  totalCount = (currentPage - 1) * pageSize + tableData.length;
                }
                const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
                const end = Math.min(currentPage * pageSize, totalCount || currentPage * pageSize);
                return (
                  <>
                    Showing{" "}
                    <span className="font-bold text-slate-700">{start}</span>
                    {" "}–{" "}
                    <span className="font-bold text-slate-700">{end}</span>
                    {" "}of{" "}
                    <span className="font-bold text-slate-700">{totalCount}</span>
                    {" "}results
                  </>
                );
              })()}
            </span>
          </div>

          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <Pagination
              key={`pagination-${pagination.currentPage}`}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange || (() => {})}
            />
          </div>
        </div>
      )}
    </div>
  );
}