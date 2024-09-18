"use client";

import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubmitButton } from "../submit-button";
import { deleteTask } from "./status-actions/actions";
import { Task } from "./types";

type DeleteTaskProps = {
  task: Pick<Task, 'id' | 'name'>;
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
