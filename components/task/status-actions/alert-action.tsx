"use client";

import React, { useTransition } from "react";
import { LoaderCircle, LucideProps } from "lucide-react";
import { Message } from "@/components/form-message";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SubmitButton } from "@/components/submit-button";

type AlertActionProps = {
  open?: boolean;
  tooltip: string;
  description: string;
  action: (formData?: FormData) => Promise<void | Message>;
  setOpen: (value: boolean) => void;
  form?: React.ReactNode;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export function AlertAction({
  open,
  Icon,
  form,
  action,
  setOpen,
  tooltip,
  description,
}: AlertActionProps) {
  const [pending, startTransition] = useTransition();

  function formAction(formData?: FormData) {
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <AlertDialog open={open || pending} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild disabled={pending}>
              {pending ? (
                <LoaderCircle className="animate-spin" size={18} />
              ) : (
                <Icon className="cursor-pointer" size={18} />
              )}
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Continuar?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <form>
          {form}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <SubmitButton formAction={formAction}>Continuar</SubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
