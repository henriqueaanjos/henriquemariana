import { InputHTMLAttributes } from "react";
import { LiquidGlassWrapper } from "./LiquidGlassWrapper";

type inputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    dark?: boolean;
};

export default function Input({ label, error,dark = false, ...rest }: inputProps) {
    return (
        <div className="w-full flex flex-col font-lora z-2">
            <h5 className={`text-xs ${dark ? 'text-primary-dark' : 'text-primary-light'} uppercase font-light px-2 py-1`}>{label}</h5>
            <LiquidGlassWrapper className="bg-background/20 rounded-xl w-full">
                <input
                    type="text"
                    className={`w-full placeholder:font-thin placeholder:italic  ${dark ? 'text-primary-dark' : 'text-primary-light'} px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent`}
                    {...rest}
                />
            </LiquidGlassWrapper>
            {error && (
                    <p className="text-xs text-red-300 font-light px-2 py-1">{error}</p>
                )}
        </div>
    )
}