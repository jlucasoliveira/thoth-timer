"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskFormModal } from "./task-form-modal";

export function AddTaskModal() {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Adicionar tarefa
      </Button>
      <TaskFormModal isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}
