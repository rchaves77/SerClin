import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm font-bold uppercase focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
