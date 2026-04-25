import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Debug logging
  // console.log("Pagination props:", {
  //   currentPage,
  //   currentPageType: typeof currentPage,
  //   totalPages,
  //   totalPagesType: typeof totalPages,
  // });

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near the start
      if (currentPage <= 3) {
        end = 4;
      }

      // Adjust if near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const changePage = (page) => {
    const next = Math.min(Math.max(Number(page) || 1, 1), Math.max(totalPages, 1));
    if (next !== currentPage) {
      onPageChange(next);
    }
  };

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      {/* First Page Button - Hidden on mobile */}
      <button
        type="button"
        onClick={() => changePage(1)}
        disabled={currentPage === 1}
        className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm"
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      {/* Previous Button */}
      <button
        type="button"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm"
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers - Compact on mobile */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center justify-center w-9 h-9 text-slate-500"
              >
                ...
              </span>
            );
          }

          const isActive = Number(page) === Number(currentPage);

          // On mobile, only show current page and adjacent ones if needed, or just hide non-active if space is tight
          // For now, we'll hide non-active pages on very small screens if there are many
          return (
            <button
              key={page}
              type="button"
              onClick={() => changePage(page)}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                ? "bg-blue-600 text-white border border-blue-600 shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 hidden sm:inline-flex shadow-sm"
                }`}
            >
              {page}
            </button>
          );
        })}
        {/* Mobile current page indicator if not in list above (simplified approach) */}
        <span className="sm:hidden flex items-center justify-center px-2 text-sm text-slate-600 font-medium">
            {currentPage} / {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm"
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Last Page Button - Hidden on mobile */}
      <button
        type="button"
        onClick={() => changePage(totalPages)}
        disabled={currentPage === totalPages}
        className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm"
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </nav>
  );
};
