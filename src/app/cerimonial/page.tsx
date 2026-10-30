
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CaretDown,
    CaretUp,
    CheckCircle,
    CheckCircleIcon,
    Clock,
    FloppyDisk,
    MagnifyingGlass,
    PencilSimple,
    Users,
    WhatsappLogo,
    XCircle,
} from "@phosphor-icons/react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    buildCerimonialWhatsAppUrl,
    getCerimonialGuests,
    updateCerimonialGuestStatus,
    type CerimonialGuest,
    type RSVPGuestStatus,
} from "@/src/services/cerimonial";

import { EditCerimonialGuestModal } from "@/src/components/cerimonial/EditCerimonialGuestModal";

type FilterStatus = "all" | RSVPGuestStatus;

type SortColumn =
    | "name"
    | "familyName"
    | "familyCode"
    | "phone"
    | "status";

const MESSAGE_TEMPLATE_KEY = "admin-rsvp-invite-template";

const DEFAULT_MESSAGE_TEMPLATE = `Olá, {{nome}}! Tudo bem? ` +
    "Estamos entrando em contato para confirmar sua presença " +
    "no casamento de Mariana e Henrique, no dia 09/01/2027. " +
    "Poderia nos informar se estará presente?"

const statusLabels: Record<RSVPGuestStatus, string> = {
    confirmed: "Confirmado",
    pending: "Pendente",
    declined: "Recusado",
};

const statusStyles: Record<RSVPGuestStatus, string> = {
    confirmed: "border-emerald-100 bg-emerald-50 text-emerald-700",
    pending: "border-amber-100 bg-amber-50 text-amber-700",
    declined: "border-rose-100 bg-rose-50 text-rose-700",
};

function StatusBadge({ status }: { status: RSVPGuestStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
            {statusLabels[status]}
        </span>
    );
}

function SummaryCard({
    label,
    value,
    icon: Icon,
    iconClass,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    iconClass: string;
}) {
    return (
        <div className="rounded-[22px] border border-[#2c2925]/7 bg-white/60 p-5">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#77716a]">{label}</p>

                <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={20} weight="duotone" />
                </span>
            </div>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#2c2925]">
                {value}
            </p>
        </div>
    );
}

function SortableHeader({
    label,
    column,
    activeColumn,
    order,
    onSort,
}: {
    label: string;
    column: SortColumn;
    activeColumn: SortColumn;
    order: "asc" | "desc";
    onSort: (column: SortColumn) => void;
}) {
    const active = activeColumn === column;

    return (
        <th className="px-6 py-4 text-left">
            <button
                type="button"
                onClick={() => onSort(column)}
                className={`inline-flex items-center gap-2 whitespace-nowrap font-medium transition hover:text-[#6e4c12] ${active ? "text-[#6e4c12]" : ""
                    }`}
            >
                {label}

                {active ? (
                    order === "asc" ? (
                        <CaretUp size={14} weight="bold" />
                    ) : (
                        <CaretDown size={14} weight="bold" />
                    )
                ) : (
                    <CaretDown size={14} className="opacity-30" />
                )}
            </button>
        </th>
    );
}

export default function CerimonialPage() {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterStatus>("all");

    const [sortColumn, setSortColumn] = useState<SortColumn>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const [selectedGuest, setSelectedGuest] =
        useState<CerimonialGuest | null>(null);

    const [messageTemplate, setMessageTemplate] = useState(
        DEFAULT_MESSAGE_TEMPLATE,
    );

    const [templateLoaded, setTemplateLoaded] = useState(false);
    const [showTemplateEditor, setShowTemplateEditor] = useState(false);

    // Carrega o modelo de mensagem salvo no navegador.
    useEffect(() => {
        const savedTemplate = localStorage.getItem(MESSAGE_TEMPLATE_KEY);

        if (savedTemplate !== null) {
            setMessageTemplate(savedTemplate);
        }

        setTemplateLoaded(true);
    }, []);

    // Salva automaticamente as alterações do modelo.
    useEffect(() => {
        if (!templateLoaded) return;

        localStorage.setItem(MESSAGE_TEMPLATE_KEY, messageTemplate);
    }, [messageTemplate, templateLoaded]);

    // Busca os convidados.
    const {
        data: guests = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["cerimonial-guests"],
        queryFn: getCerimonialGuests,
    });

    // Atualiza somente o status de confirmação.
    const updateMutation = useMutation({
        mutationFn: ({
            guestId,
            status,
        }: {
            guestId: string;
            status: RSVPGuestStatus;
        }) => updateCerimonialGuestStatus(guestId, status),

        onSuccess: (_, variables) => {
            queryClient.setQueryData<CerimonialGuest[]>(
                ["cerimonial-guests"],
                (current = []) =>
                    current.map((guest) =>
                        guest.id === variables.guestId
                            ? { ...guest, status: variables.status }
                            : guest,
                    ),
            );

            setSelectedGuest(null);
        },
    });

    // Indicadores.
    const counts = useMemo(
        () => ({
            total: guests.length,
            confirmed: guests.filter(
                (guest) => guest.status === "confirmed",
            ).length,
            pending: guests.filter(
                (guest) => guest.status === "pending",
            ).length,
            declined: guests.filter(
                (guest) => guest.status === "declined",
            ).length,
        }),
        [guests],
    );

    // Busca, filtros e ordenação.
    const filteredGuests = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return guests
            .filter((guest) => {
                const matchesStatus =
                    filter === "all" || guest.status === filter;

                const matchesSearch =
                    !normalizedSearch ||
                    guest.name.toLowerCase().includes(normalizedSearch) ||
                    guest.familyName.toLowerCase().includes(normalizedSearch) ||
                    guest.familyCode.toLowerCase().includes(normalizedSearch) ||
                    (guest.phone ?? "").includes(normalizedSearch);

                return matchesStatus && matchesSearch;
            })
            .sort((a, b) => {
                const first = a[sortColumn] ?? "";
                const second = b[sortColumn] ?? "";

                const comparison = String(first).localeCompare(
                    String(second),
                    "pt-BR",
                    {
                        numeric: true,
                        sensitivity: "base",
                    },
                );

                return sortOrder === "asc" ? comparison : -comparison;
            });
    }, [guests, search, filter, sortColumn, sortOrder]);

    function handleSort(column: SortColumn) {
        if (sortColumn === column) {
            setSortOrder((current) =>
                current === "asc" ? "desc" : "asc",
            );

            return;
        }

        setSortColumn(column);
        setSortOrder("asc");
    }

    function handleEditGuestStatus(status: RSVPGuestStatus) {
        if (!selectedGuest) return;

        updateMutation.mutate({
            guestId: selectedGuest.id,
            status,
        });
    }

    function openWhatsApp(guest: CerimonialGuest) {
        if (!guest.phone) return;

        const confirmationLink = `${window.location.origin}/rsvp/${guest.familyCode}`;

        const variables: Record<string, string> = {
            nome: guest.name,
            familia: guest.familyName,
            codigo: guest.familyCode,
            link: confirmationLink,
        };

        const message = messageTemplate.replace(
            /{{\s*(nome|familia|codigo|link)\s*}}/gi,
            (_, variable: string) => variables[variable.toLowerCase()] ?? "",
        );

        const whatsappUrl = buildCerimonialWhatsAppUrl(
            guest,
            message,
        );

        if (whatsappUrl) {
            window.open(
                whatsappUrl,
                "_blank",
                "noopener,noreferrer",
            );
        }
    }

    const filters: {
        label: string;
        value: FilterStatus;
        count: number;
    }[] = [
            {
                label: "Todos",
                value: "all",
                count: counts.total,
            },
            {
                label: "Confirmados",
                value: "confirmed",
                count: counts.confirmed,
            },
            {
                label: "Pendentes",
                value: "pending",
                count: counts.pending,
            },
            {
                label: "Recusados",
                value: "declined",
                count: counts.declined,
            },
        ];

    return (
        <main className="min-h-screen bg-[#f7f4ef] px-4 py-6 text-[#2c2925] sm:px-6 sm:py-8 lg:px-10">
            <div className="mx-auto max-w-[1440px]">
                {/* Cabeçalho */}
                <header className="mb-8 flex flex-col gap-5 border-b border-[#2c2925]/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8b744c]">
                            Mariana & Henrique
                        </p>

                        <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
                            Gestão de convidados
                        </h1>

                        <p className="mt-2 text-sm text-[#77716a]">
                            Acompanhe as confirmações de presença do casamento.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-start rounded-2xl border border-[#2c2925]/7 bg-white/60 px-4 py-3 sm:self-auto">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9b982]/20 text-[#6e4c12]">
                            <Users size={21} weight="duotone" />
                        </div>

                        <div>
                            <p className="text-xs text-[#77716a]">
                                Área da cerimonialista
                            </p>

                            <p className="text-sm font-medium">
                                Controle de RSVP
                            </p>
                        </div>
                    </div>
                </header>

                {/* Indicadores */}
                <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        label="Total de convidados"
                        value={counts.total}
                        icon={Users}
                        iconClass="bg-[#d9b982]/20 text-[#6e4c12]"
                    />

                    <SummaryCard
                        label="Confirmados"
                        value={counts.confirmed}
                        icon={CheckCircle}
                        iconClass="bg-emerald-50 text-emerald-700"
                    />

                    <SummaryCard
                        label="Aguardando resposta"
                        value={counts.pending}
                        icon={Clock}
                        iconClass="bg-amber-50 text-amber-700"
                    />

                    <SummaryCard
                        label="Não comparecerão"
                        value={counts.declined}
                        icon={XCircle}
                        iconClass="bg-rose-50 text-rose-700"
                    />
                </section>

                {/* Listagem */}
                <section className="overflow-hidden rounded-[26px] border border-[#2c2925]/7 bg-white/70">
                    {/* Busca e filtros */}
                    <div className="border-b border-[#2c2925]/7 p-5 sm:p-6">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Lista de convidados
                                </h2>

                                <p className="mt-1 text-sm text-[#77716a]">
                                    Consulte os dados e atualize as confirmações.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative min-w-0 sm:w-72">
                                    <MagnifyingGlass
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#938b80]"
                                    />

                                    <input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Buscar convidado ou família..."
                                        className="h-11 w-full rounded-xl border border-[#2c2925]/10 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-[#aaa39a] focus:border-[#b99a60]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                            {filters.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setFilter(item.value)}
                                    className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${filter === item.value
                                            ? "border-[#6e4c12] bg-[#6e4c12] text-white"
                                            : "border-[#2c2925]/10 bg-white text-[#6d665e] hover:border-[#6e4c12]/40"
                                        }`}
                                >
                                    {item.label}

                                    <span className="ml-2 opacity-70">
                                        {item.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Modelo de mensagem */}
                    <div className="border-b border-[#2c2925]/7 px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#292722]">
                                    Modelo de mensagem
                                </p>

                                <p className="mt-1 text-xs text-[#8A867D]">
                                    Personalize o texto utilizado nos contatos pelo WhatsApp.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowTemplateEditor((current) => !current)
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-[#2c2925]/10 bg-white px-4 text-sm font-medium text-[#6e4c12] transition hover:bg-[#f8f6f2]"
                            >
                                <PencilSimple size={16} />

                                {showTemplateEditor
                                    ? "Fechar editor"
                                    : "Editar mensagem padrão"}
                            </button>
                        </div>

                        {showTemplateEditor && (
                            <div className="mt-5 space-y-4">
                                <textarea
                                    value={messageTemplate}
                                    onChange={(event) =>
                                        setMessageTemplate(event.target.value)
                                    }
                                    rows={9}
                                    className="w-full resize-y rounded-xl border border-[#2c2925]/10 bg-white p-4 text-sm leading-6 text-[#292722] outline-none transition focus:border-[#b99a60]"
                                    placeholder="Escreva seu modelo de mensagem..."
                                />

                                <div className="rounded-xl bg-[#f8f6f2] p-4">
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8A867D]">
                                        Variáveis disponíveis
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "{{nome}}",
                                            "{{familia}}",
                                            "{{codigo}}",
                                            "{{link}}",
                                        ].map((variable) => (
                                            <button
                                                key={variable}
                                                type="button"
                                                onClick={() =>
                                                    setMessageTemplate(
                                                        (current) => `${current}${variable}`,
                                                    )
                                                }
                                                className="rounded-lg border border-[#2c2925]/10 bg-white px-3 py-2 font-mono text-xs text-[#6e4c12] transition hover:border-[#b99a60]"
                                            >
                                                {variable}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-[#8A867D]">
                                        O modelo é salvo automaticamente neste navegador.
                                    </p>

                                    <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700">
                                        <FloppyDisk size={16} />
                                        Salvamento automático
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabela */}
                    {isLoading ? (
                        <div className="px-6 py-16 text-center text-sm text-[#77716a]">
                            Carregando convidados...
                        </div>
                    ) : isError ? (
                        <div className="px-6 py-16 text-center">
                            <p className="text-sm text-rose-700">
                                Não foi possível carregar a lista de convidados.
                            </p>

                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="mt-3 text-sm font-medium text-[#6e4c12] underline underline-offset-4"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : filteredGuests.length === 0 ? (
                        <div className="px-6 py-16 text-center text-sm text-[#77716a]">
                            Nenhum convidado encontrado com esses filtros.
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1000px] border-collapse text-left">
                                    <thead>
                                        <tr className="bg-[#f8f6f2] text-xs uppercase tracking-wider text-[#8b847a]">
                                            <SortableHeader
                                                label="Convidado"
                                                column="name"
                                                activeColumn={sortColumn}
                                                order={sortOrder}
                                                onSort={handleSort}
                                            />

                                            <SortableHeader
                                                label="Família"
                                                column="familyName"
                                                activeColumn={sortColumn}
                                                order={sortOrder}
                                                onSort={handleSort}
                                            />

                                            <SortableHeader
                                                label="Código"
                                                column="familyCode"
                                                activeColumn={sortColumn}
                                                order={sortOrder}
                                                onSort={handleSort}
                                            />

                                            <SortableHeader
                                                label="Telefone"
                                                column="phone"
                                                activeColumn={sortColumn}
                                                order={sortOrder}
                                                onSort={handleSort}
                                            />

                                            <SortableHeader
                                                label="Confirmação"
                                                column="status"
                                                activeColumn={sortColumn}
                                                order={sortOrder}
                                                onSort={handleSort}
                                            />

                                            <th className="px-6 py-4 text-right font-medium">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#2c2925]/6">
                                        {filteredGuests.map((guest) => {
                                            const hasPhone = Boolean(guest.phone);

                                            return (
                                                <tr
                                                    key={guest.id}
                                                    className="transition hover:bg-[#faf8f4]"
                                                >
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium">
                                                            {guest.name}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-[#6d665e]">
                                                        {guest.familyName}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span className="rounded-lg bg-[#f3efe8] px-2.5 py-1 font-mono text-xs text-[#6e4c12]">
                                                            {guest.familyCode}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-[#6d665e]">
                                                        {guest.phone || "Não informado"}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={guest.status} />
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedGuest(guest)
                                                                }
                                                                title="Editar confirmação"
                                                                className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#2c2925]/10 bg-white px-3 text-xs font-medium text-[#6e4c12] transition hover:bg-[#f8f6f2]"
                                                            >
                                                                <CheckCircleIcon size={16} />
                                                                Alterar Confirmação
                                                            </button>

                                                            {hasPhone ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openWhatsApp(guest)
                                                                    }
                                                                    title={`Enviar WhatsApp para ${guest.name}`}
                                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                                                                >
                                                                    <WhatsappLogo
                                                                        size={19}
                                                                        weight="fill"
                                                                    />
                                                                </button>
                                                            ) : (
                                                                <span className="px-2 text-xs text-[#aaa39a]">
                                                                    Sem telefone
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-t border-[#2c2925]/7 px-6 py-4 text-xs text-[#8b847a]">
                                Exibindo {filteredGuests.length} de {guests.length} convidados
                            </div>
                        </>
                    )}
                </section>

                {/* Erro ao atualizar */}
                {updateMutation.isError && (
                    <p className="mt-4 text-sm text-rose-700">
                        Não foi possível atualizar a confirmação. Tente novamente.
                    </p>
                )}

                {/* Modal de edição */}
                <EditCerimonialGuestModal
                    open={!!selectedGuest}
                    guest={selectedGuest}
                    isLoading={updateMutation.isPending}
                    onClose={() => setSelectedGuest(null)}
                    onSubmit={handleEditGuestStatus}
                />
            </div>
        </main>
    );
}
