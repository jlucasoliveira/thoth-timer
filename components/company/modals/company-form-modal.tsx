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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Tables, TablesInsert } from "@/database.types";
import { useToast } from "@/hooks/use-toast";
import { extractChangedValues } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { FormType, schema } from "./validation";
import { parseFormDataIntoPayload } from "./utils";

type CompanyFormModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  company?: Tables<"companies">;
};

export function CompanyFormModal({
  isOpen,
  setOpen,
  company,
}: CompanyFormModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const client = createClient();
  const subtitle = company?.id ? "Editar" : "Adicionar";
  const [isLoading, setLoading] = useState<boolean>(false);
  const form = useForm<FormType>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormType) {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await client.auth.getUser();
      const payload = parseFormDataIntoPayload(data, user!);
      if (company?.id) {
        const changes = extractChangedValues(company, payload);
        await client.from("companies").update(changes).eq("id", company.id);
      } else {
        await client
          .from("companies")
          .insert(payload as TablesInsert<"companies">);
      }
      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Ocorreu um erro ao salvar a empresa" });
    }
    setLoading(false);
  }

  useEffect(() => {
    if (company) {
      form.setValue("name", company.name ?? "");
      form.setValue("priceByHour", company.price_by_hour ?? 0);
    }
  }, [company, form.setValue]);

  return (
    <Dialog modal open={isOpen || isLoading} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subtitle} empresa</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <div>
            <Input control={form.control} name="name" label="Nome" required />
            <Input
              control={form.control}
              name="priceByHour"
              label="Preço por hora"
              type="number"
              min={0}
            />
          </div>
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
