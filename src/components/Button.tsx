const variantClasses = {
  primary: "bg-sky-500 text-white shadow-sm hover:bg-sky-600",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
  dangerOutline: "border border-red-100 bg-white text-red-600 hover:bg-red-50",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
