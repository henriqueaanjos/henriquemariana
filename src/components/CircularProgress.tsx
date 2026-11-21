type CircularProgressProps = {
    value: number;
    size?: number;
    stroke?: number;
    label?: string;
};

export function CircularProgress({
    value,
    size = 96,
    stroke = 8,
    label,
}: CircularProgressProps) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, value));
    const offset =
        circumference - (clamped / 100) * circumference;

    return (
        <div
            className="relative inline-flex items-center justify-center"
            style={{ width: size, height: size }}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <svg
                width={size}
                height={size}
                className="-rotate-90"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    className="text-primary/25"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-primary transition-[stroke-dashoffset] duration-300"
                />
            </svg>

            <div className="absolute flex flex-col items-center">
                <span className="font-lora text-lg text-background">
                    {Math.round(clamped)}%
                </span>
                {label && (
                    <span className="text-[10px] text-background/70">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
}