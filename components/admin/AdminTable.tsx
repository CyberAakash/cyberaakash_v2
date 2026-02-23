"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Archive, 
  Trash2, 
  RotateCcw, 
  MoreVertical, 
  CheckSquare, 
  Square,
  ChevronDown,
  Filter,
  X,
  Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onBulkArchive: (ids: string[]) => void;
  onBulkRestore: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
  searchPlaceholder?: string;
  searchKey: keyof T;
}

export function AdminTable<T extends { id: string; is_archived?: boolean }>({
  data,
  columns,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
  onBulkArchive,
  onBulkRestore,
  onBulkDelete,
  searchPlaceholder = "Search items...",
  searchKey,
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const isCorrectTab = activeTab === "archived" ? item.is_archived : !item.is_archived;
      const matchesSearch = String(item[searchKey])
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return isCorrectTab && matchesSearch;
    });
  }, [data, searchTerm, activeTab, searchKey]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Reset page on search or tab change
  useMemo(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, activeTab]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((item) => item.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: "archive" | "restore" | "delete") => {
    if (selectedIds.length === 0) return;
    
    if (action === "archive") onBulkArchive(selectedIds);
    else if (action === "restore") onBulkRestore(selectedIds);
    else if (action === "delete") {
      if (confirm(`Are you sure you want to permanently delete ${selectedIds.length} items?`)) {
        onBulkDelete(selectedIds);
      }
    }
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border/50">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => { setActiveTab("active"); setSelectedIds([]); }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === "active" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Active
            </button>
            <button
              onClick={() => { setActiveTab("archived"); setSelectedIds([]); }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                activeTab === "archived" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Archived
            </button>
          </div>
          
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-1 focus:ring-foreground transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <span className="text-xs text-muted-foreground mr-2">{selectedIds.length} selected</span>
              {activeTab === "active" ? (
                <button
                  onClick={() => handleBulkAction("archive")}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg text-xs font-medium transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archive
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleBulkAction("restore")}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg text-xs font-medium transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </>
              )}
              <div className="w-px h-6 bg-border mx-1" />
              <button 
                onClick={() => setSelectedIds([])}
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="p-4 w-10">
                  <button 
                    onClick={toggleSelectAll}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {selectedIds.length === filteredData.length && filteredData.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-foreground" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                {columns.map((col, i) => (
                  <th key={i} className={cn("p-4 text-xs font-mono uppercase tracking-widest text-muted-foreground", col.className)}>
                    {col.header}
                  </th>
                ))}
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr 
                    key={item.id} 
                    className={cn(
                      "group hover:bg-muted/30 transition-colors",
                      selectedIds.includes(item.id) && "bg-muted/50"
                    )}
                  >
                    <td className="p-4">
                      <button 
                        onClick={() => toggleSelect(item.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {selectedIds.includes(item.id) ? (
                          <CheckSquare className="w-4 h-4 text-foreground" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    {columns.map((col, i) => (
                      <td key={i} className={cn("p-4 text-sm", col.className)}>
                        {typeof col.accessorKey === "function" 
                          ? col.accessorKey(item)
                          : (item[col.accessorKey] as React.ReactNode)}
                      </td>
                    ))}
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => onEdit(item)} className="gap-2">
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </DropdownMenuItem>
                          {activeTab === "active" ? (
                            <DropdownMenuItem 
                              onClick={() => onArchive(item.id)}
                              className="gap-2 text-amber-500 focus:text-amber-500"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              Archive
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem 
                                onClick={() => onRestore(item.id)}
                                className="gap-2 text-emerald-500 focus:text-emerald-500"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  if (confirm("Permanently delete this item?")) onDelete(item.id);
                                }}
                                className="gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 2} className="p-12 text-center text-muted-foreground text-sm">
                    No items found in {activeTab} view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-muted/30 border-t border-border/50">
            <div className="text-xs text-muted-foreground font-mono">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} items
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                Prev
              </button>
              <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] md:max-w-none px-2 py-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-mono transition-all shrink-0",
                      currentPage === i + 1 
                        ? "bg-foreground text-background font-bold" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-muted rounded-lg text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
