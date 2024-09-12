"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { Tables } from "@/database.types";
import { TagFormModal } from "./tag-form-modal";

type EditTagModalProps = {
  tag: Tables<"tags">;
};

export function EditTagModal({ tag }: EditTagModalProps) {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <Edit
        size={18}
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <TagFormModal key={tag.id} isOpen={isOpen} setOpen={setOpen} tag={tag} />
    </>
  );
}
