"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagFormModal } from "./tag-form-modal";

export function AddTagModal() {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Adicionar tag
      </Button>
      <TagFormModal isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}
