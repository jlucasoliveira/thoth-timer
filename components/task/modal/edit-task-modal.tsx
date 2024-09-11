"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TaskFormModal } from "./task-form-modal";
import { Task } from "../types";

type EditTaskModalProps = {
  task: Task;
};

export function EditTaskModal({ task }: EditTaskModalProps) {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Edit
              size={18}
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar tarefa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TaskFormModal isOpen={isOpen} setOpen={setOpen} task={task} />
    </>
  );
}
