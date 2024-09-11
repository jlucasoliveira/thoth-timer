"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/database.types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DeleteTaskProps = {
  task: Tables<"tasks">;
};

export function DeleteTask({ task }: DeleteTaskProps) {
  const router = useRouter();
  const client = createClient();
  const [loading, setLoading] = useState<boolean>(false);

  async function onDelete() {
    try {
      setLoading(true);
      await client.from("tasks").delete().eq("id", task.id);
      router.refresh();
      toast({
        title: `Tarefa "${task.name}" removida com sucesso!`,
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Trash
                size="18"
                className="cursor-pointer"
                onClick={() => onDelete()}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Remover tarefa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
