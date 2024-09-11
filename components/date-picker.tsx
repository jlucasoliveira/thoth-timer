"use client";

import * as React from "react";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPickerSingleProps } from "react-day-picker";
import { Control, FieldValues, Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import { dateFormat } from "@/lib/datetime";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

type DatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  asChild?: boolean;
  description?: string;
  control: Control<T, any>;
  calendarProps?: Omit<DayPickerSingleProps, "mode">;
};

export function DatePicker<T extends FieldValues>({
  control,
  name,
  label,
  asChild,
  description,
  calendarProps,
}: DatePickerProps<T>) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-1 flex-col gap-1">
          {asChild ? null : <FormLabel className="text-sm">{label}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  aria-expanded={open}
                  className={cn(
                    "justify-between text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    dateFormat(field.value)
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                {...calendarProps}
                mode="single"
                locale={ptBR}
                selected={field.value}
                onSelect={(props) => {
                  setOpen(false);
                  field.onChange(props);
                }}
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
