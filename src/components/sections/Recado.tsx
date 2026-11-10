
"use client";

import { getMessages, type Message, sendMessage } from "@/src/services/messages";
import Input from "../Input";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import Textarea from "../Textarea";
import { Suspense } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const messageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome precisa de pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),

  message: z
    .string()
    .trim()
    .min(3, "A mensagem precisa de pelo menos 3 caracteres")
    .max(500, "A mensagem deve ter no máximo 500 caracteres"),
});

type MessageFormData = z.infer<typeof messageSchema>;

export function Recado() {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      name: "",
      message: "",
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: getMessages,
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
  });

  const { mutateAsync: mutateSendMessage, isPending } = useMutation({
    mutationFn: sendMessage,
    onSuccess(data) {
      queryClient.setQueryData<Message[]>(
        ["messages"],
        (msgs) => [data, ...(msgs ?? [])],
      );
    },
  });

  async function handleSendMessage(messageData: MessageFormData) {
    try {
      await mutateSendMessage(messageData);
      reset();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  }

  return (
    <section
      id="message"
      className="
        relative flex min-h-svh w-full flex-col
        items-center bg-[url('/AYM_8721.JPG')] bg-cover bg-top bg-no-repeat
        px-4 pb-8 pt-28
        sm:px-6 sm:pb-10 sm:pt-32
        lg:h-screen lg:min-h-0 lg:max-h-screen lg:w-screen
        lg:px-8 lg:pb-14 lg:pt-36
      "
    >
      <div className="relative z-10 flex w-full shrink-0 flex-col items-center text-center">
        <div className="border-b-2 border-primary px-2 pb-1">
          <h1 className="font-cormorant text-2xl font-bold uppercase text-primary-light sm:text-3xl">
            Recado
          </h1>
        </div>

        <h5 className="mt-2 max-w-2xl font-lora text-xs uppercase leading-relaxed text-primary-light sm:text-sm">
          DEIXE SUA MENSAGEM DE CARINHO PARA OS NOIVOS
        </h5>
      </div>

      <div
        className="
          relative z-10 mt-6 flex w-full flex-1 flex-col gap-4
          sm:mt-7 sm:gap-5
          lg:min-h-0 lg:flex-row-reverse lg:pb-6
        "
      >
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:justify-center">
          {/* Formulário */}
          <LiquidGlassWrapper
            className="
              w-full shrink-0 rounded-3xl bg-black/70
              lg:w-[30%]
            "
          >
            <div className="flex w-full flex-col items-center gap-5 p-4 sm:gap-6 sm:p-5 lg:h-full lg:gap-8 lg:p-4 overflow-y-scroll">
              <div className="shrink-0 border-b-2 border-primary px-2 pb-1 text-center">
                <h2 className="font-cormorant text-base uppercase text-primary-light">
                  Deixe o seu recado
                </h2>
              </div>

              <div className="flex w-full flex-1 flex-col gap-4">
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Nome"
                      placeholder="Digite seu nome completo"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="message"
                  render={({ field, fieldState }) => (
                    <Textarea
                      label="Mensagem"
                      placeholder="Digite sua mensagem"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="w-full shrink-0">
                <LiquidGlassWrapper className="relative h-full w-full rounded-lg bg-primary-dark/70">
                  <button
                    type="button"
                    className="z-10 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 px-3 py-2"
                    onClick={handleSubmit(handleSendMessage)}
                    disabled={isPending}
                  >
                    <p className="font-lora text-sm uppercase text-background">
                      {isPending ? "Enviando..." : "Enviar"}
                    </p>
                  </button>
                </LiquidGlassWrapper>
              </div>
            </div>
          </LiquidGlassWrapper>

          {/* Recados recebidos */}
          <LiquidGlassWrapper
            className="
              flex min-h-[22rem] w-full flex-col rounded-3xl bg-black/70
              sm:min-h-[26rem]
              lg:h-full lg:min-h-0 lg:w-[50%]
            "
          >
            <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-5 p-4 sm:gap-6 sm:p-5 lg:gap-8 lg:p-4 overflow-y-scroll">
              <div className="shrink-0 border-b-2 border-primary px-2 pb-1 text-center">
                <h2 className="font-cormorant text-base uppercase text-primary-light">
                  Recados recebidos
                </h2>
              </div>

              <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto rounded-2xl sm:gap-4 lg:rounded-3xl">
                <Suspense
                  fallback={
                    <p className="text-sm text-primary-light font-lora">
                      Carregando recados...
                    </p>
                  }
                >
                  {messages && messages.length > 0 ? (
                    messages.map((message) => (
                      <LiquidGlassWrapper
                        className="w-full shrink-0 rounded-2xl bg-black/30 sm:rounded-3xl"
                        key={message.id}
                      >
                        <div className="flex min-w-0 flex-row items-start gap-3 px-3 py-3 sm:gap-4 sm:px-5">
                          <img
                            src={`https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(message.name)}`}
                            alt={`Avatar de ${message.name}`}
                            className="aspect-square h-10 w-10 shrink-0 rounded-full sm:h-11 sm:w-11"
                          />

                          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 pt-1">
                            <p className="break-words font-cormorant text-xs font-bold uppercase text-primary-light sm:text-sm">
                              {message.name}
                            </p>

                            <p className="whitespace-pre-wrap break-words font-lora text-sm leading-relaxed text-primary-light">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </LiquidGlassWrapper>
                    ))
                  ) : (
                    <p className="px-2 py-4 text-center font-lora text-sm text-primary-light">
                      Nenhum recado recebido ainda.
                    </p>
                  )}
                </Suspense>
              </div>
            </div>
          </LiquidGlassWrapper>
        </div>
      </div>
    </section>
  );
}
