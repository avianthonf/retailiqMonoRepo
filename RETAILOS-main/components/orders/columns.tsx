"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  profitMargin: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

const statusConfig = {
  Pending: { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500", border: "border-amber-500/20" },
  Processing: { bg: "bg-blue-500/10", text: "text-blue-500", dot: "bg-blue-500", border: "border-blue-500/20" },
  Shipped: { bg: "bg-purple-500/10", text: "text-purple-500", dot: "bg-purple-500", border: "border-purple-500/20" },
  Delivered: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500", border: "border-green-500/20" },
  Cancelled: { bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500", border: "border-red-500/20" },
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Order #",
    cell: ({ row }) => <div className="font-mono text-sm font-medium tabular-nums text-muted-foreground">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("customer")}</div>,
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => <div className="tabular-nums font-medium text-muted-foreground">{row.getValue("items")}</div>,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium tabular-nums text-foreground">{formatted}</div>;
    },
  },
  {
    accessorKey: "profitMargin",
    header: "Profit Margin",
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("profitMargin"));
      const isHigh = profit >= 20;
      const isLow = profit <= 10;
      const color = isHigh ? "text-green-500" : isLow ? "text-red-500" : "text-amber-500";
      const Icon = isHigh ? ArrowUpRight : isLow ? ArrowDownRight : ArrowRight;
      
      return (
        <div className={`flex items-center gap-1 font-medium tabular-nums ${color}`}>
          <Icon className="h-3.5 w-3.5" />
          {profit}%
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];
      const config = statusConfig[status];
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${config.bg} ${config.text} ${config.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div className="tabular-nums font-medium text-muted-foreground text-sm">{row.getValue("date")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View order details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
