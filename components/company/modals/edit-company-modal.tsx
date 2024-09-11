"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { Tables } from "@/database.types";
import { CompanyFormModal } from "./company-form-modal";

type EditCompanyModalProps = {
  company: Tables<"companies">;
};

export function EditCompanyModal({ company }: EditCompanyModalProps) {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <Edit size={18} className="cursor-pointer" onClick={() => setOpen(true)} />
      <CompanyFormModal isOpen={isOpen} setOpen={setOpen} company={company} />
    </>
  );
}
