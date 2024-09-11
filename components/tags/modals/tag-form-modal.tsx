"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Tables, TablesInsert } from "@/database.types";
import { extractChangedValues } from "@/lib/utils";
import { FormType, schema } from "./validation";
import { parseFormDataIntoPayload } from "./utils";

type TagFormModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  tag?: Tables<"tags">;
};

export function TagFormModal({ isOpen, setOpen, tag }: TagFormModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const client = createClient();
  const subtitle = tag?.id ? "Editar" : "Adicionar";
  const [isLoading, setLoading] = useState<boolean>(false);
  const form = useForm<FormType>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormType) {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await client.auth.getUser();
      const payload = parseFormDataIntoPayload(data, user!);
      if (tag?.id) {
        const changes = extractChangedValues(tag, payload);
        await client.from("tags").update(changes).eq("id", tag.id);
      } else {
        await client.from("tags").insert(payload as TablesInsert<"tags">);
        form.reset();
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Ocorreu um erro ao salvar a tag" });
    }
    setLoading(false);
  }

  useEffect(() => {
    if (tag) {
      form.setValue("name", tag.name ?? "");
    }
  }, [tag, form.setValue]);

  return (
    <Dialog modal open={isOpen || isLoading} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subtitle} tag</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <Input control={form.control} name="name" label="Nome" required />
        </FormProvider>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            Salvar{" "}
            {isLoading ? <LoaderCircle className="animate-spin" /> : null}
          </Button>
          <Button
            variant="ghost"
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
