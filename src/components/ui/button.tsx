import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lav-400)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--lav-400)] text-white hover:bg-[var(--lav-500)]",
        outline:
          "border border-[var(--border)] bg-white hover:bg-[var(--lav-50)] text-[var(--text-default)]",
        secondary:
          "bg-[var(--lav-50)] text-[var(--lav-600)] hover:bg-[var(--lav-100)]",
        ghost: "hover:bg-[var(--lav-50)] text-[var(--text-default)]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        link: "text-[var(--lav-500)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
