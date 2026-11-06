"use client";

import { useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  FilePdf,
  Wallet,
  X,
} from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { AnimatePresence, motion } from "motion/react";

import Input from "../Input";
import { LiquidGlassWrapper } from "../LiquidGlassWrapper";
import { Modal } from "../Modal";

import {
  getRSVP,
  submitRSVP,
  type RSVPFamily,
  type RSVPMember,
  type RSVPStatus,
} from "@/src/services/rsvp";

type RSVPConfirmationModalProps = {
  isOpen: boolean;
  familyName: string;
  members: RSVPMember[];
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function RSVPConfirmationModal({
  isOpen,
  familyName,
  members,
  isLoading,
  onClose,
  onConfirm,
}: RSVPConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  const pendingMembers = members.filter(
    (member) => member.status === "PENDING",
  );

  const declinedMembers = members.filter(
    (member) => member.status === "DECLINED",
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex h-full w-full flex-col gap-5 sm:gap-6">
        <div className="flex w-full flex-col items-center">
          <div className="border-b-2 border-primary px-2 pb-1 text-center">
            <h1 className="font-cormorant text-base uppercase text-primary-light">
              Confirme suas respostas
            </h1>
          </div>

          <p className="mt-3 text-center font-cormorant text-sm uppercase text-primary-light/80">
            {members.length > 1 && "Família "}
            {familyName}
          </p>

          <p className="mt-4 max-w-sm text-center font-lora text-xs leading-relaxed text-background/75">
            Algumas respostas ainda não foram confirmadas ou foram recusadas.
            Deseja enviar essas respostas mesmo assim?
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {pendingMembers.length > 0 && (
            <div className="rounded-xl bg-background/5 px-3 py-3 sm:px-4">
              <p className="font-lora text-xs text-background/80">
                {pendingMembers.length}{" "}
                {pendingMembers.length === 1
                  ? "convidado sem resposta"
                  : "convidados sem resposta"}
              </p>
            </div>
          )}

          {declinedMembers.length > 0 && (
            <div className="rounded-xl bg-background/5 px-3 py-3 sm:px-4">
              <p className="font-lora text-xs text-background/80">
                {declinedMembers.length}{" "}
                {declinedMembers.length === 1
                  ? "convidado recusou"
                  : "convidados recusaram"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto flex w-full gap-2">
          <LiquidGlassWrapper className="w-full rounded-lg bg-background/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center px-2 font-lora text-[10px] uppercase text-background transition-opacity hover:opacity-70 disabled:opacity-40 sm:text-xs"
            >
              Voltar
            </button>
          </LiquidGlassWrapper>

          <LiquidGlassWrapper className="w-full rounded-lg bg-primary-dark/70">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center px-2 font-lora text-[10px] uppercase text-background disabled:opacity-50 sm:text-xs"
            >
              {isLoading ? "Enviando..." : "Confirmar"}
            </button>
          </LiquidGlassWrapper>
        </div>
      </div>
    </Modal>
  );
}

function MemberResponse({
  member,
  onChange,
}: {
  member: RSVPMember;
  onChange: (status: RSVPStatus) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3 border-b border-background/10 pb-4 last:border-b-0 last:pb-0">
      <p className="break-words font-cormorant text-base uppercase text-primary-light">
        {member.name}
      </p>

      <div className="flex w-full gap-2">
        <button
          type="button"
          onClick={() => onChange("CONFIRMED")}
          className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border transition-all sm:gap-2 ${member.status === "CONFIRMED"
            ? "border-primary bg-primary/20 text-primary-light"
            : "border-background/10 bg-background/5 text-background/60 hover:bg-background/10"
            }`}
        >
          <Check size={15} weight="bold" />

          <span className="font-lora text-[10px] uppercase">
            Confirmo
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChange("DECLINED")}
          className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border transition-all sm:gap-2 ${member.status === "DECLINED"
            ? "border-[#b8786e]/50 bg-[#b8786e]/15 text-[#e0a39a]"
            : "border-background/10 bg-background/5 text-background/60 hover:bg-background/10"
            }`}
        >
          <X size={15} weight="bold" />

          <span className="font-lora text-[10px] uppercase">
            Recuso
          </span>
        </button>
      </div>
    </div>
  );
}

async function svgToPng(
  svg: SVGSVGElement,
  outputSize = 1200,
): Promise<string> {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;

  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clonedSvg.setAttribute("width", String(outputSize));
  clonedSvg.setAttribute("height", String(outputSize));

  const svgString = new XMLSerializer().serializeToString(clonedSvg);

  const blob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Erro ao carregar SVG."));
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Não foi possível criar o canvas.");
    }

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, outputSize, outputSize);
    context.drawImage(image, 0, 0, outputSize, outputSize);

    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function loadMonogram(): Promise<{
  data: string;
  width: number;
  height: number;
}> {
  const response = await fetch("/monograma_2.svg");

  if (!response.ok) {
    throw new Error("Não foi possível carregar o monograma.");
  }

  const svgText = await response.text();

  const blob = new Blob([svgText], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(
        new Error("Erro ao carregar o monograma."),
      );
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || 500;
    canvas.height = image.naturalHeight || 500;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Não foi possível processar o monograma.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return {
      data: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}


function RSVPSuccess({
  family,
  onBack,
}: {
  family: RSVPFamily;
  onBack: () => void;
}) {
  const qrRef = useRef<SVGSVGElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const isIndividualInvite = family.members.length === 1;

  async function handleDownloadPDF() {
    if (!qrRef.current || isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      const [qrImage, monogram] = await Promise.all([
        svgToPng(qrRef.current, 1200),
        loadMonogram(),
      ]);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const primaryLight = [255, 246, 230] as const;
      const primary = [217, 185, 130] as const;
      const primaryDark = [110, 76, 18] as const;

      // Fundo
      pdf.setFillColor(...primaryLight);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Moldura externa
      pdf.setDrawColor(...primary);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(12, 12, 186, 273, 3, 3, "S");

      // Moldura interna
      pdf.setDrawColor(...primary);
      pdf.setLineWidth(0.2);
      pdf.roundedRect(15, 15, 180, 267, 2, 2, "S");

      // Monograma
      const monogramMaxWidth = 30;
      const monogramMaxHeight = 30;

      const aspectRatio = monogram.width / monogram.height;

      let monogramWidth = monogramMaxWidth;
      let monogramHeight = monogramWidth / aspectRatio;

      if (monogramHeight > monogramMaxHeight) {
        monogramHeight = monogramMaxHeight;
        monogramWidth = monogramHeight * aspectRatio;
      }

      pdf.addImage(
        monogram.data,
        "PNG",
        (pageWidth - monogramWidth) / 2,
        27,
        monogramWidth,
        monogramHeight,
      );

      // Nomes do casal
      pdf.setTextColor(...primaryDark);
      pdf.setFont("times", "normal");
      pdf.setFontSize(25);
      pdf.text("Mariana & Henrique", pageWidth / 2, 76, {
        align: "center",
      });

      // Data
      pdf.setFontSize(10);
      // pdf.setCharSpace(2);
      pdf.text("09 · 01 · 2027", pageWidth / 2, 85, {
        align: "center",
      });
      pdf.setCharSpace(0);

      // Linha decorativa
      pdf.setDrawColor(...primary);
      pdf.setLineWidth(0.5);
      pdf.line(65, 96, 145, 96);

      // Título
      pdf.setFont("times", "normal");
      pdf.setFontSize(20);
      pdf.text("Confirmação de Presença", pageWidth / 2, 112, {
        align: "center",
      });

      // Nome do convidado ou da família
      pdf.setFontSize(13);
      pdf.text(
        `${isIndividualInvite ? "" : "Família "}${family.name}`,
        pageWidth / 2,
        124,
        { align: "center" },
      );

      // QR Code
      const qrSize = 68;
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = 137;

      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(
        qrX - 5,
        qrY - 5,
        qrSize + 10,
        qrSize + 10,
        3,
        3,
        "F",
      );

      pdf.addImage(qrImage, "PNG", qrX, qrY, qrSize, qrSize);

      // Código de confirmação
      pdf.setFont("times", "bold");
      pdf.setFontSize(10);
      pdf.text("CÓDIGO DE CONFIRMAÇÃO", pageWidth / 2, 224, {
        align: "center",
      });

      pdf.setFont("times", "normal");
      pdf.setFontSize(19);
      pdf.text(family.code, pageWidth / 2, 237, {
        align: "center",
      });

      // Orientação
      pdf.setFontSize(10);
      pdf.text(
        "Apresente este código na entrada do evento.",
        pageWidth / 2,
        253,
        { align: "center" },
      );

      // Rodapé
      pdf.setDrawColor(...primary);
      pdf.line(65, 263, 145, 263);

      pdf.setFontSize(9);
      pdf.setTextColor(...primaryDark);
      pdf.text(
        "Será uma alegria celebrar esse momento com vocês!",
        pageWidth / 2,
        273,
        { align: "center" },
      );

      const safeFamilyName = family.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      pdf.save(`Convite-${safeFamilyName || family.code}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      window.alert(
        "Não foi possível gerar seu PDF. Tente novamente.",
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  return (
    <motion.div
      key="success"
      custom={1}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex h-full w-full flex-col items-center justify-between gap-6 p-4 sm:gap-8 sm:p-6"
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="Voltar para o código de confirmação"
        className="absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-background/15 bg-background/5 text-background/70 transition-all hover:bg-background/10 hover:text-background sm:left-4 sm:top-4"
      >
        <ArrowLeft size={15} />
      </button>

      <div className="flex w-full flex-col items-center pt-6 sm:pt-2">
        <div className="border-b-2 border-primary px-2 pb-1 text-center">
          <h1 className="font-cormorant text-base uppercase text-primary-light">
            Presença confirmada
          </h1>
        </div>

        <p className="mt-3 text-center font-cormorant text-sm uppercase text-primary-light/80">
          {isIndividualInvite ? "" : "Família "}
          {family.name}
        </p>

        <p className="mt-4 max-w-sm text-center font-lora text-xs leading-relaxed text-background/75">
          Obrigado por confirmar. Será uma alegria celebrar esse momento
          especial com vocês.
        </p>
      </div>

      <div className="flex max-w-full flex-col items-center gap-3 sm:gap-4">
        <div className="rounded-2xl bg-white p-3 shadow-xl sm:rounded-3xl sm:p-6">
          <QRCodeSVG
            ref={qrRef}
            value={`${window.location.origin}/rsvp/${family.code}`}
            size={220}
            level="H"
            style={{
              display: "block",
              width: "min(220px, 58vw)",
              height: "auto",
            }}
          />
        </div>

        <p className="break-all text-center font-lora text-[10px] uppercase tracking-[0.12em] text-background/50">
          Código: {family.code}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        <LiquidGlassWrapper className="w-full rounded-lg bg-primary-dark/70">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex h-11 w-full items-center justify-center gap-2 px-3 font-lora text-xs uppercase text-background transition-opacity hover:opacity-80 disabled:cursor-wait disabled:opacity-50"
          >
            <FilePdf size={17} weight="regular" />
            {isGeneratingPDF ? "Gerando PDF..." : "Salvar PDF"}
          </button>
        </LiquidGlassWrapper>
      </div>
    </motion.div>
  );
}


const slideVariants = {
  enter: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction === 1 ? 40 : -40,
  }),

  center: {
    opacity: 1,
    x: 0,
  },

  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction === 1 ? -40 : 40,
  }),
};

export function RSVP() {
  const [code, setCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [members, setMembers] = useState<RSVPMember[]>([]);
  const [family, setFamily] = useState<RSVPFamily | null>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [finished, setFinished] = useState(false);

  const [direction, setDirection] = useState<1 | -1>(1);

  const {
    refetch: validateCode,
    isFetching: isValidating,
    error: validationError,
  } = useQuery({
    queryKey: ["rsvp", submittedCode],
    queryFn: () => getRSVP(submittedCode),
    enabled: false,
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      submitRSVP(
        submittedCode,
        members
          .filter(
            (member) =>
              member.status === "CONFIRMED" ||
              member.status === "DECLINED",
          )
          .map((member) => ({
            id: member.id,
            status: member.status as "CONFIRMED" | "DECLINED",
          })),
      ),

    onSuccess: (data) => {
      setMembers(
        data.members.map((member) => ({
          ...member,
          status: member.status,
        })),
      );

      setShowConfirmation(false);
      setDirection(1);
      setFinished(true);
    },
  });

  const hasPending = useMemo(
    () => members.some((member) => member.status === "PENDING"),
    [members],
  );

  const hasDeclined = useMemo(
    () => members.some((member) => member.status === "DECLINED"),
    [members],
  );

  async function handleValidate() {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return;
    }

    setSubmittedCode(normalizedCode);

    const result = await validateCode();

    if (result.data) {
      setFamily(result.data);
      setMembers(result.data.members);
      setFinished(false);
      setDirection(1);
    }
  }

  function handleMemberChange(memberId: string, status: RSVPStatus) {
    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === memberId
          ? {
            ...member,
            status,
          }
          : member,
      ),
    );
  }

  function handleSubmit() {
    if (hasPending || hasDeclined) {
      setShowConfirmation(true);
      return;
    }

    submitMutation.mutate();
  }

  function handleBackToCode() {
    setDirection(-1);

    setFamily(null);
    setMembers([]);
    setFinished(false);
    setShowConfirmation(false);
    setSubmittedCode("");
    setCode("");
  }

  function handleBackToMembers() {
    setDirection(-1);
    setFinished(false);
  }

  const currentStep = !family
    ? "code"
    : finished
      ? "success"
      : "members";

  return (
    <section
      id="rsvp"
      className="
        relative flex min-h-svh w-full flex-col
        items-center bg-[url('/AYM_8521_5.jpeg')] bg-[30%_center] bg-cover sm:bg-top bg-no-repeat
        px-4 pb-8 pt-28
        sm:px-6 sm:pb-10 sm:pt-32
        lg:h-screen lg:min-h-0 lg:w-screen lg:px-8 lg:pb-14 lg:pt-36
      "
    >
      <div className="relative z-10 flex w-full shrink-0 flex-col items-center text-center">
        <div className="border-b-2 border-primary px-2 pb-1">
          <h1 className="font-cormorant text-2xl font-bold uppercase text-primary-dark sm:text-3xl">
            RSVP
          </h1>
        </div>

        <h5 className="mt-2 font-lora text-xs uppercase text-primary-dark sm:text-sm">
          CONFIRME A SUA PRESENÇA!
        </h5>
      </div>

      <div className="relative z-10 mt-6 flex w-full flex-1 flex-col items-center justify-center mb-10 lg:mt-7 lg:min-h-0 lg:flex-row-reverse">
        <div className="flex w-full flex-col items-center justify-start lg:w-1/2 lg:justify-start">
          <motion.div
            layout
            transition={{
              layout: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            className="w-full max-w-xl rounded-3xl bg-black/40 lg:w-[50%] lg:max-w-none"
          >
            <LiquidGlassWrapper className="w-full rounded-3xl bg-black/70">
              <AnimatePresence
                mode="wait"
                initial={false}
                custom={direction}
              >
                {!family ? (
                  <motion.div
                    key="code"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex w-full flex-col items-center gap-8 p-4 sm:gap-12 sm:p-5 lg:gap-20 lg:p-4"
                  >
                    <div className="border-b-2 border-primary px-2 pb-1 text-center">
                      <h1 className="font-cormorant text-base uppercase text-primary-light">
                        Confirme a presença
                      </h1>
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      <Input
                        label="Código de Confirmação"
                        placeholder="Digite o código"
                        value={code}
                        onChange={(event) =>
                          setCode(event.target.value)
                        }
                      />

                      {validationError && (
                        <p className="px-1 font-lora text-[10px] text-red-200">
                          Convite não encontrado. Verifique o código
                          informado.
                        </p>
                      )}
                    </div>

                    <LiquidGlassWrapper className="relative w-full rounded-lg bg-primary-dark/70">
                      <button
                        type="button"
                        onClick={handleValidate}
                        disabled={isValidating || !code.trim()}
                        className="z-10 flex h-11 w-full cursor-pointer flex-col items-center justify-center gap-2 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12"
                      >
                        <p className="font-lora text-sm uppercase text-background">
                          {isValidating ? "Validando..." : "Validar"}
                        </p>
                      </button>
                    </LiquidGlassWrapper>
                  </motion.div>
                ) : finished ? (
                  <RSVPSuccess
                    key="success"
                    family={family}
                    onBack={handleBackToCode}
                  />
                ) : (
                  <motion.div
                    key="members"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative flex max-h-[70svh] min-h-0 w-full flex-col gap-5 overflow-y-auto p-4 sm:max-h-[65svh] sm:gap-6 sm:p-5 lg:max-h-[60vh] lg:p-4"
                  >
                    <button
                      type="button"
                      onClick={handleBackToCode}
                      aria-label="Voltar"
                      className="absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-background/15 bg-background/5 text-background/70 transition-all hover:bg-background/10 hover:text-background sm:left-4 sm:top-4"
                    >
                      <ArrowLeft size={15} />
                    </button>

                    <div className="flex w-full flex-col items-center pt-6 sm:pt-1">
                      <div className="max-w-full border-b-2 border-primary px-2 pb-1 text-center">
                        <h1 className="break-words font-cormorant text-base uppercase text-primary-light">
                          {members.length > 1 && "Família "}
                          {family.name}
                        </h1>
                      </div>

                      <p className="mt-3 text-center font-lora text-xs uppercase text-background/60">
                        Quem estará conosco?
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-4">
                      {members.map((member) => (
                        <MemberResponse
                          key={member.id}
                          member={member}
                          onChange={(status) =>
                            handleMemberChange(member.id, status)
                          }
                        />
                      ))}
                    </div>

                    <div className="mt-auto w-full pt-2">
                      <LiquidGlassWrapper className="relative w-full rounded-lg bg-primary-dark/70">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={submitMutation.isPending}
                          className="z-10 flex h-11 w-full items-center justify-center px-3 py-2 font-lora text-xs uppercase text-background disabled:opacity-50 sm:text-sm"
                        >
                          {submitMutation.isPending
                            ? "Enviando..."
                            : "Enviar confirmação"}
                        </button>
                      </LiquidGlassWrapper>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </LiquidGlassWrapper>
          </motion.div>
        </div>
      </div>

      <RSVPConfirmationModal
        isOpen={showConfirmation}
        familyName={family?.name ?? ""}
        members={members}
        isLoading={submitMutation.isPending}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => submitMutation.mutate()}
      />
    </section>
  );
}