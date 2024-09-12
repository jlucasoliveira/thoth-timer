"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { ProjectFormModal, Project } from "./project-form-modal";

type EditProjectModalProps = {
  project: Project;
};

export function EditProjectModal({ project }: EditProjectModalProps) {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <Edit
        size={18}
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <ProjectFormModal
        key={project.id}
        isOpen={isOpen}
        setOpen={setOpen}
        project={project}
      />
    </>
  );
}
