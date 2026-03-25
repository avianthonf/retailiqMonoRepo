"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const OrderDetailSlideover = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="sm" className="rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary transition-colors">
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {/* Order details content goes here */}
          <p>Order ID: #1234</p>
          <p>Customer: John Doe</p>
          {/* Timeline of status changes */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailSlideover;
