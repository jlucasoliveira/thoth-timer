"use client";

import React from "react";
import { LoaderCircle, LucideProps } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AlertActionProps = {
  open?: boolean;
  tooltip: string;
  loading?: boolean;
  description: string;
  onSubmit: () => Promise<void>;
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
  setOpen,
  tooltip,
  loading,
  onSubmit,
  description,
}: AlertActionProps) {
  return (
    <AlertDialog open={open || loading} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild disabled={loading}>
              {loading ? (
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
        {form}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={onSubmit}>
            Continuar{" "}
            {loading ? <LoaderCircle className="animate-spin" /> : null}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
