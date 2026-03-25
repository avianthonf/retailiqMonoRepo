"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { addDays, format } from "date-fns";

import { Table } from "@tanstack/react-table";

interface TableFiltersProps<TData> {
  table: Table<TData>;
}

const TableFilters = <TData,>({ table }: TableFiltersProps<TData>) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const isFiltered = table.getState().rowSelection && Object.keys(table.getState().rowSelection).length > 0;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute w-[18px] h-[18px] text-muted-foreground/70 left-3.5 top-1/2 -translate-y-1/2" />
          <Input 
            placeholder="Search by customer or order..." 
            className="pl-10 h-10 rounded-full border-border/50 bg-secondary/20 shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-colors" 
          />
        </div>
        <Select>
          <SelectTrigger className="w-[160px] h-10 rounded-full border-border/50 bg-secondary/20 shadow-none focus:ring-1 focus:ring-primary/50 transition-colors">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-xl shadow-black/5 dark:shadow-black/40 border-border/40">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger
            id="date"
            className="inline-flex items-center justify-start whitespace-nowrap rounded-full text-sm font-medium h-10 px-4 py-2 border border-border/50 bg-secondary/20 shadow-none hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 w-[280px] text-left transition-colors"
          >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              className="rounded-xl shadow-xl border border-border/40"
            />
          </PopoverContent>
        </Popover>
        {isFiltered && (
            <div className="flex items-center gap-2 ml-2">
                <Button
                variant="secondary"
                size="sm"
                className="rounded-full h-10 px-4 font-semibold hover:bg-secondary/80 outline-none"
                >
                Mark as Shipped
                </Button>
                <Button
                variant="outline"
                size="sm"
                className="rounded-full h-10 px-4 font-semibold border-border/50 shadow-sm"
                >
                Export Selected
                </Button>
            </div>
        )}
      </div>
      <Button className="rounded-full h-10 px-6 font-semibold shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95">
        New Order
      </Button>
    </div>
  );
};

export default TableFilters;
