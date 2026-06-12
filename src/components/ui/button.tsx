import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  [key: string]: any;
}

export function Button({ children, variant = "default", className = "", ...props }: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-black transition-all active:scale-[0.98] outline-none disabled:opacity-50 pointer-events-auto h-12 px-6 rounded-xl text-xs uppercase tracking-widest cursor-pointer";
  
  const variantStyles = {
    default: "bg-[#0a2d54] text-white hover:bg-[#bfa571] hover:text-white",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "bg-transparent hover:bg-gray-50 text-gray-600",
  };

  const selectedStyle = variantStyles[variant] || variantStyles.default;

  return (
    <button className={`${baseStyle} ${selectedStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}
