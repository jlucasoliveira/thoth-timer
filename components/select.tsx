import { Control, FieldValues, Path } from "react-hook-form";
import { ItemIndicator } from "@radix-ui/react-select";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RequirementIndicator } from "./requirement-indicator";

export type Option = {
  label: string;
  value: string;
};

type SelectProps<T extends FieldValues> = {
  label: string;
  placeholder: string;
  description?: string;
  name: Path<T>;
  control: Control<T, any>;
  options: Option[];
  asChild?: boolean;
  required?: boolean;
};

export function Select<T extends FieldValues>({
  name,
  label,
  control,
  asChild,
  required,
  options,
  placeholder,
  description,
}: SelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {asChild ? null : (
            <FormLabel>
              {label} <RequirementIndicator required={required} />
            </FormLabel>
          )}
          <FormControl>
            <UISelect
              onValueChange={field.onChange}
              value={field.value}
              required={required}
            >
              <SelectTrigger onBlur={field.onBlur}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                    <ItemIndicator />
                  </SelectItem>
                ))}
              </SelectContent>
            </UISelect>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
