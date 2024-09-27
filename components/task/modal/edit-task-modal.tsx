"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TaskWithHour } from "../types";
import { TaskFormModal } from "./task-form-modal";

type EditTaskModalProps = {
  task: TaskWithHour;
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
      <TaskFormModal
        key={task.id}
        isOpen={isOpen}
        setOpen={setOpen}
        task={task}
      />
    </>
  );
}
