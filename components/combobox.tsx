"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { RequirementIndicator } from "./requirement-indicator";
import { useDebounce } from "@/hooks/use-debounce";

type ComboboxProps<T extends FieldValues, F> = {
  options: F[];
  name: Path<T>;
  label: string;
  control: Control<T, any>;
  placeholder?: string;
  description?: string;
  getOptionValue: (option?: F) => string;
  getOptionLabel: (option?: F) => string;
  setSearch?: (term: string) => void;
  required?: boolean;
};

export function Combobox<T extends FieldValues, F>({
  name,
  label,
  control,
  options,
  required,
  setSearch,
  description,
  placeholder,
  getOptionLabel,
  getOptionValue,
}: ComboboxProps<T, F>) {
  const [open, setOpen] = React.useState<boolean>(false);

  const setDebouncedSearch = useDebounce(setSearch ?? (() => {}), 300);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <FormItem className="flex flex-col gap-1">
          <FormLabel className="mt-2">
            {label} <RequirementIndicator required={required} />{" "}
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "justify-between text-left font-normal",
                    !value && "text-muted-foreground",
                  )}
                >
                  {getOptionLabel(value) || placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command shouldFilter={setSearch === undefined}>
                <CommandInput
                  placeholder="Busque..."
                  onValueChange={setDebouncedSearch}
                />
                <CommandList>
                  <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={getOptionValue(option)}
                        value={getOptionValue(option)}
                        onSelect={() => {
                          onChange(option);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            getOptionValue(option) === getOptionValue(value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {getOptionLabel(option)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
