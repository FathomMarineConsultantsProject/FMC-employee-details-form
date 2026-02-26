import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  requiredMark?: boolean;
  error?: string;
  hint?: string;
};

export default function Input({
  label,
  requiredMark,
  error,
  hint,
  className = "",
  ...rest
}: Props) {
  return (
    <div className="w-full">
      <label className="text-base font-semibold text-slate-800">
        {label} {requiredMark ? <span className="text-rose-500">*</span> : null}
      </label>

      {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}

      <input
        className={[
          "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900",
          "placeholder:text-slate-400",
          "shadow-sm outline-none transition",
          "focus:ring-4 focus:ring-teal-100",
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
            : "border-slate-300 focus:border-teal-500",
          className,
        ].join(" ")}
        {...rest}
      />

      {error ? <p className="mt-2 text-sm font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}