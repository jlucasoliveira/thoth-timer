"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectFormModal } from "./project-form-modal";

export function AddProjectModal() {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Adicionar projeto
      </Button>
      <ProjectFormModal isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}
