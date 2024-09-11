"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/database.types";

type DeleteTagProps = {
  tag: Tables<"tags">;
};

export function DeleteTag({ tag }: DeleteTagProps) {
  const router = useRouter();
  const client = createClient();
  const [loading, setLoading] = useState<boolean>(false);

  async function onDelete() {
    try {
      setLoading(true);
      await client.from("tags").delete().eq("id", tag.id);
      router.refresh();
      toast({
        title: `Tag ${tag.name} removida com sucesso!`,
        onOpenChange: (open) => {
          if (!open) setLoading(false);
          return open;
        },
      });
    } catch (error) {
      toast({
        title: "Ocorreu um erro ao excluir a tag",
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
