"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyFormModal } from "./company-form-modal";

export function AddCompanyModal() {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Adicionar empresa
      </Button>
      <CompanyFormModal isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}
