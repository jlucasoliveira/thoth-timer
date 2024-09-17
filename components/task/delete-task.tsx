"use client";

import { Trash } from "lucide-react";
import { Tables } from "@/database.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubmitButton } from "../submit-button";
import { deleteTask } from "./status-actions/actions";

type DeleteTaskProps = {
  task: Tables<"tasks">;
};

export function DeleteTask({ task }: DeleteTaskProps) {
  const action = deleteTask.bind(null, task);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild type="submit">
          <SubmitButton
            size="icon"
            variant="outline"
            formAction={action}
            className="!w-fit !h-fit p-0 border-0"
            overrideContentOnLoading
          >
            <Trash size="18" className="cursor-pointer" />
          </SubmitButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remover tarefa</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
