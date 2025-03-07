"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePicker({
  className,
  date,
  setDate,
  disablePrev = false,
}: {
  className: string;
  date?: Date | undefined;
  setDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  disablePrev?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          required
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={(day) => {
            if (!disablePrev) return false; // If disablePrev is false, allow all dates

            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1); // Get yesterday's date

            return day < yesterday; // Disable all dates before yesterday
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
