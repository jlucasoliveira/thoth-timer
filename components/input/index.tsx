import { Control, FieldValues, Path } from "react-hook-form";
import { Input as UInput, InputProps as UInputProps } from "../ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RequirementIndicator } from "../requirement-indicator";

type InputProps<T extends FieldValues> = UInputProps & {
  label: string;
  name: Path<T>;
  asChild?: boolean;
  description?: string;
  control: Control<T, any>;
};

export function Input<T extends FieldValues>({
  name,
  control,
  label,
  asChild,
  description,
  ...props
}: InputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {asChild ? null : (
            <FormLabel>
              {label} <RequirementIndicator {...props} />
            </FormLabel>
          )}
          <FormControl>
            <UInput {...field} {...props} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
