import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Entre</h1>
      <p className="text-sm text-foreground">
        Não possui uma conta?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Cadastre-se
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="eu@examplo.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Senha</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Sua senha"
          required
        />
        <SubmitButton pendingText="Entrando..." formAction={signInAction}>
          Entrar
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
