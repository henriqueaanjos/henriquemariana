export function Loading() {
    return (
        <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
            <p className="text-primary-dark text-lg font-semibold">Carregando...</p>
        </div>
    );
}