"use client";

import { Trash } from "lucide-react";
import { Tables } from "@/database.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { SubmitButton } from "../submit-button";
import { deleteCompany } from "./actions";

type DeleteCompanyProps = {
  company: Tables<"companies">;
};

export function DeleteCompany({ company }: DeleteCompanyProps) {
  const action = deleteCompany.bind(null, company);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild type="submit">
          <SubmitButton
            size="icon"
            variant="outline"
            formAction={action}
            overrideContentOnLoading
            className="!h-fit !w-fit !m-0 !border-0"
          >
            <Trash size={18} className="cursor-pointer" />
          </SubmitButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remover Empresa</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
