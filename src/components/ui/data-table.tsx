import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  totalPages?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onGlobalFilterChange?: (filter: string) => void;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = { pageIndex: 0, pageSize: 10 },
  totalPages = 1,
  onPaginationChange,
  onGlobalFilterChange,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    onGlobalFilterChange?.(value);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={globalFilter}
              onChange={(event) => handleGlobalFilterChange(event.target.value)}
              className="pl-9 w-72"
              aria-label="Search leads"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="font-normal">
            Total: {data.length} leads
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-subtle">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-foreground">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="text-muted-foreground">Loading leads...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-hover transition-colors"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">No leads found.</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or add a new lead.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing page {pagination.pageIndex + 1} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => 
              onPaginationChange?.({ 
                ...pagination, 
                pageIndex: pagination.pageIndex - 1 
              })
            }
            disabled={pagination.pageIndex === 0}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => 
              onPaginationChange?.({ 
                ...pagination, 
                pageIndex: pagination.pageIndex + 1 
              })
            }
            disabled={pagination.pageIndex >= totalPages - 1}
            aria-label="Go to next page"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}