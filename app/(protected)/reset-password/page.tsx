import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Recuperar senha</h1>
      <p className="text-sm text-foreground/60">
        Por favor, insira sua nova senha a baixa.
      </p>
      <Label htmlFor="password">Nova senha</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword">Confirme sua senha</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        Recuperar senha
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
