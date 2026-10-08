"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";

import { AxiosError } from "axios";

import {
    adminLogin,
} from "@/src/services/admin";
import { z } from "zod";
import Input from "@/src/components/Input";
import { Button } from "@/src/components/Button";

export const adminLoginSchema = z.object({
    password: z
        .string()
        .min(1, "Digite sua senha."),
});

export type AdminLoginInput = z.infer<
    typeof adminLoginSchema
>;

interface AdminLoginError {
    error: string;
}

export default function LoginPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm<AdminLoginInput>({
        resolver:
            zodResolver(adminLoginSchema),
    });

    const loginMutation = useMutation<
        unknown,
        AxiosError<AdminLoginError>,
        string
    >({
        mutationFn: adminLogin,

        onSuccess: () => {
            router.replace("/admin");
            router.refresh();
        },
    });

    function onSubmit(
        data: AdminLoginInput
    ) {
        loginMutation.mutate(
            data.password
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center flex-col bg-background">
            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    opacity-40
                    bg-[radial-gradient(circle_at_50%_50%,var(--color-primary)_0%,transparent_70%)]
                "
            />
            <Image src='/monograma_2.svg'
                alt='Monograma' 
                width={62}
                height={67}
                className="cursor-pointer mb-20"
            />
            <form
                onSubmit={handleSubmit(
                    onSubmit
                )}
                className="w-full max-w-sm space-y-6"
            >
                <div className="z-1 flex w-full flex-col items-center">
                    <div className="border-b-2 border-primary pb-1 px-2">
                        <h1 className="text-3xl font-bold text-primary-dark uppercase font-cormorant">
                            Administração
                        </h1>
                    </div>
                    <h5 className="text-primary-dark text-center text-sm  uppercase font-lora mt-2">
                        Digite a senha para acessar o painel de administração.
                    </h5>
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
                        disabled={
                            loginMutation.isPending
                        }
                        error={errors.password?.message}
                     />
                    )}
                />

                {loginMutation.isError && (
                    <p className="text-sm text-red-500">
                        {loginMutation.error
                            ?.response
                            ?.data
                            ?.error ??
                            "Não foi possível realizar o login."}
                    </p>
                )}

                <Button 
                    type="submit"
                    disabled={
                        loginMutation.isPending
                    }
                >
                    {loginMutation.isPending
                        ? "Entrando..."
                        : "Entrar"}
                </Button>

                <button
                    
                    className="w-full rounded-xl px-4 py-3 disabled:opacity-50"
                >
                    
                </button>
            </form>
        </main>
    );
}