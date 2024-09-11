"use client";

import { LoaderCircle, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteProjectProps = {
  project: Tables<"projects">;
};

export function DeleteProject({ project }: DeleteProjectProps) {
  const router = useRouter();
  const client = createClient();
  const [loading, setLoading] = useState<boolean>(false);

  async function onDelete() {
    try {
      setLoading(true);
      await client.from("projects").delete().eq("id", project.id);
      router.refresh();
      toast({
        title: `${project.name} removido com sucesso!`,
        onOpenChange: (open) => {
          if (!open) setLoading(false);
          return open;
        },
      });
    } catch (error) {
      toast({
        title: "Ocorreu um erro ao excluir a empresa",
        variant: "destructive",
      });
    }
  }

  return (
    <div role="button">
      {loading ? (
        <LoaderCircle className="animate-spin" size="18" />
      ) : (
        <Trash
          className="cursor-pointer"
          size="18"
          onClick={() => onDelete()}
        />
      )}
    </div>
  );
}
