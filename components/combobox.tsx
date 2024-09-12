"use client";

import * as React from "react";
import { CommandLoading } from "cmdk";
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
import { useDebounce } from "@/hooks/use-debounce";
import { RequirementIndicator } from "./requirement-indicator";

type ComboboxProps<T extends FieldValues, F> = {
  options: F[];
  name: Path<T>;
  label: string;
  isMulti?: boolean;
  isLoading?: boolean;
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
  isMulti,
  required,
  isLoading,
  setSearch,
  description,
  placeholder,
  getOptionLabel,
  getOptionValue,
}: ComboboxProps<T, F>) {
  const [open, setOpen] = React.useState<boolean>(false);

  const setDebouncedSearch = useDebounce(setSearch ?? (() => {}), 300);

  function isSelect(value: F | Array<F>, option: F): boolean {
    if (Array.isArray(value))
      return value.some(
        (item) => getOptionValue(item) === getOptionValue(option),
      );

    return getOptionValue(value) === getOptionValue(option);
  }

  return (
    <FormField
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <FormItem className="flex flex-1 flex-col">
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
                  {(Array.isArray(value)
                    ? (value as Array<F>)
                        .map((v) => getOptionLabel(v))
                        .join(", ")
                    : getOptionLabel(value)) || placeholder}
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
                  {isLoading ? <CommandLoading /> : null}
                  <CommandGroup>
                    {options.map((option) =>
                      isMulti && isSelect(value, option) ? null : (
                        <CommandItem
                          key={getOptionValue(option)}
                          value={getOptionValue(option)}
                          onSelect={() => {
                            onChange(
                              isMulti ? [...(value ?? []), option] : option,
                            );
                            if (!isMulti) setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelect(value, option)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {getOptionLabel(option)}
                        </CommandItem>
                      ),
                    )}
                  </CommandGroup>
                  {isMulti && (value?.length ?? 0) > 0 ? (
                    <CommandGroup heading="Selecionados">
                      {((value ?? []) as Array<F>).map((item, _, arr) => (
                        <CommandItem
                          key={getOptionValue(item)}
                          value={getOptionValue(item)}
                          onSelect={() => {
                            onChange(
                              arr.filter(
                                (option) =>
                                  getOptionValue(option) !==
                                  getOptionValue(item),
                              ),
                            );
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4 opacity-100")} />
                          {getOptionLabel(item)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null}
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
