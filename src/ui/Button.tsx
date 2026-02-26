import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export default function Button({
  loading,
  disabled,
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition shadow-sm";

  const styles =
    variant === "primary"
      ? "bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200"
      : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200";

  return (
    <button
      disabled={disabled || loading}
      className={[
        base,
        styles,
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? "Submitting..." : children}
    </button>
  );
}