"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  // base styles
  "peer cursor-pointer shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
     default:
  "border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary [&_[data-slot=checkbox-indicator]]:data-[state=checked]:text-white",
  success:
          "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600 data-[state=checked]:text-white",
        danger:
          "border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:text-white",
        warning:
          "border-yellow-400 data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black",
        info:
          "border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:text-white",
      },
      size: {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
export interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}


export function Checkbox({ className, variant, size, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ variant, size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon
          className={cn(
            size === "lg" ? "size-5" : size === "sm" ? "size-3.5" : "size-4"
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}