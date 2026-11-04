import { useId } from "react";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 read-only:cursor-not-allowed read-only:bg-slate-100 read-only:text-slate-500";

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
};

function Field({
  label,
  error,
  hint,
  id,
  children,
}: BaseProps & { id: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  ...props
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input id={id} className={inputClass} {...props} />
    </Field>
  );
}

export function TextAreaField({
  label,
  error,
  ...props
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();

  return (
    <Field id={id} label={label} error={error}>
      <textarea id={id} className={`min-h-24 ${inputClass}`} {...props} />
    </Field>
  );
}
