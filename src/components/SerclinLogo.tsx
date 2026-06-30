interface SerclinLogoProps {
  variant?: "horizontal" | "vertical" | "symbol";
  hideText?: boolean;
  isDarkBg?: boolean;
  className?: string;
  [key: string]: any;
}

export default function SerclinLogo({
  variant = "horizontal",
  hideText = false,
  isDarkBg = false,
  className = "",
  ...props
}: SerclinLogoProps) {

  if (variant === "symbol" || hideText) {
    return (
      <img
        src="/logo_symbol.png"
        alt="Instituto SerClin Logo"
        className={`w-12 h-12 flex-shrink-0 object-contain ${className}`}
        referrerPolicy="no-referrer"
        {...props}
      />
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`} {...props}>
        <img
          src="/logo_symbol.png"
          alt="Instituto SerClin Logo"
          className="w-16 h-16 flex-shrink-0 object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col items-center">
          <span className={`text-xl sm:text-2xl font-serif font-bold tracking-widest uppercase leading-tight ${isDarkBg ? "text-white" : "text-[#0a2d54]"}`}>
            Instituto SerClin
          </span>
          <span className="text-[10px] sm:text-xs font-sans font-bold tracking-[0.3em] text-[#bfa571] uppercase">
            SAÚDE E BEM ESTAR
          </span>
        </div>
      </div>
    );
  }

  // Horizontal layout (default for headers, cards, footers)
  return (
    <div className={`flex items-center ${className}`} {...props}>
      <img
        src="/logo_full.png"
        alt="Instituto SerClin"
        className="h-12 w-auto object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
