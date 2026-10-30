
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { AxiosError } from "axios";
import { z } from "zod";

import { adminLogin } from "@/src/services/admin";
import Input from "@/src/components/Input";
import { Button } from "@/src/components/Button";

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Digite sua senha."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

interface AdminLoginError {
  error: string;
}

interface AdminLoginResponse {
  success: boolean;
  role: "admin" | "cerimonial";
}

export default function LoginPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      password: "",
    },
  });

  const loginMutation = useMutation<
    AdminLoginResponse,
    AxiosError<AdminLoginError>,
    string
  >({
    mutationFn: adminLogin,


    onSuccess: (data) => {
      router.replace(
        data.role === "admin" ? "/admin" : "/cerimonial",
      );

      router.refresh();
    },

  });

  function onSubmit(data: AdminLoginInput) {
    loginMutation.mutate(data.password);
  }

  return (
    <main className="relative flex min-h-screen min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-background px-5 py-10 sm:px-8">
      {/* Background decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,var(--color-primary)_0%,transparent_70%)] opacity-30 sm:opacity-40"
      />

      {/* Conteúdo */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <Image
          src="/monograma_2.svg"
          alt="Monograma de Mariana e Henrique"
          width={62}
          height={67}
          priority
          className="mb-12 h-auto w-14 cursor-pointer sm:mb-16 sm:w-[62px]"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div className="flex w-full flex-col items-center">
            <div className="border-b-2 border-primary px-2 pb-1">
              <h1 className="font-cormorant text-2xl font-bold uppercase text-primary-dark sm:text-3xl">
                Administração
              </h1>
            </div>

            <p className="mt-3 max-w-xs text-center font-lora text-xs uppercase leading-relaxed text-primary-dark sm:text-sm">
              Digite a senha para acessar o painel de administração.
            </p>
          </div>

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                label="Senha"
                {...field}
                type="password"
                autoComplete="current-password"
                dark
                disabled={loginMutation.isPending}
                error={errors.password?.message}
              />
            )}
          />

          {loginMutation.isError && (
            <p role="alert" className="text-sm leading-relaxed text-red-500">
              {loginMutation.error?.response?.data?.error ??
                "Não foi possível realizar o login."}
            </p>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
