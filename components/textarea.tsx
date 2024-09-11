import { Control, FieldValues, Path } from "react-hook-form";
import {
  Textarea as UTextarea,
  TextareaProps as UTextareaProps,
} from "./ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RequirementIndicator } from "./requirement-indicator";

type TextareaProps<T extends FieldValues> = UTextareaProps & {
  label: string;
  description?: string;
  name: Path<T>;
  control: Control<T, any>;
  asChild?: boolean;
};

export function Textarea<T extends FieldValues>({
  name,
  control,
  label,
  description,
  asChild,
  ...props
}: TextareaProps<T>) {
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
            <UTextarea {...field} {...props} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
