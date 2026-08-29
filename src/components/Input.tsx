import { InputHTMLAttributes } from "react";
import { LiquidGlassWrapper } from "./LiquidGlassWrapper";

type inputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export default function Input({ label, ...rest }: inputProps) {
    return (
        <div className="w-full flex flex-col font-lora">
            <h5 className="text-xs text-primary-light uppercase font-light px-2 py-1">{label}</h5>
            <LiquidGlassWrapper className="bg-background/20 rounded-xl w-full">
                <input
                    type="text"
                    className="w-full placeholder:font-thin placeholder:italic text-primary-light px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    {...rest}
                />
            </LiquidGlassWrapper>
        </div>
    )
}