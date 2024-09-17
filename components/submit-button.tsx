"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof Button> & {
  overrideContentOnLoading?: boolean;
};

export function SubmitButton({
  children,
  overrideContentOnLoading,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      {...props}
      className={cn("flex flex-row gap-2", props.className)}
    >
      {overrideContentOnLoading && pending ? null : children}
      {pending ? <LoaderCircle size={18} className="animate-spin" /> : null}
    </Button>
  );
}
