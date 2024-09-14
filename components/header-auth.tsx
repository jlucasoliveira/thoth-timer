import Link from "next/link";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";

type AuthButtonProps = {
  className?: string;
};

export default async function AuthButton({ className }: AuthButtonProps) {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className={cn("flex items-center gap-4", className)}>
      Bem-vindo, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sair
        </Button>
      </form>
    </div>
  ) : (
    <div className={cn("flex gap-2", className)}>
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Entrar</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Cadastrar</Link>
      </Button>
    </div>
  );
}
