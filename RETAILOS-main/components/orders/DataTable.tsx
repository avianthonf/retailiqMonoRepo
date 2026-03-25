"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  Table as ReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  children: (table: ReactTable<TData>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  children,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      {children(table)}
      <div className="relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        {isLoading && (
          <div className="w-full h-1 bg-muted/30 overflow-hidden relative">
            <motion.div
              className="absolute top-0 h-full bg-primary/70"
              initial={{ left: "-100%", width: "30%" }}
              animate={{ left: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        )}
        <Table>
          <TableHeader className="bg-muted/30 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border/40">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12 px-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group relative border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors"
                >
                  {/* Subtle active state marker */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                  
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                      <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">No orders found</p>
                      <p className="text-sm text-muted-foreground">Adjust your filters or query to see results.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-xs text-muted-foreground font-medium">
          Showing page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-full px-5 font-medium border-border/50 hover:bg-muted/50 transition-colors disabled:opacity-40"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-full px-5 font-medium border-border/50 hover:bg-muted/50 transition-colors disabled:opacity-40"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
