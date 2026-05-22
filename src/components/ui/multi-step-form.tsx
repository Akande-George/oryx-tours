"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const multiStepFormVariants = cva("flex flex-col overflow-hidden", {
  variants: {
    size: {
      default: "md:w-[720px]",
      sm: "md:w-[560px]",
      lg: "md:w-[880px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface MultiStepFormProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof multiStepFormVariants> {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  stepLabel?: string;
  onBack: () => void;
  onNext: () => void;
  onClose?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  nextDisabled?: boolean;
  footerContent?: React.ReactNode;
}

const MultiStepForm = React.forwardRef<HTMLDivElement, MultiStepFormProps>(
  (
    {
      className,
      size,
      currentStep,
      totalSteps,
      title,
      description,
      stepLabel,
      onBack,
      onNext,
      onClose,
      backButtonText = "Back",
      nextButtonText = "Next step",
      nextDisabled = false,
      footerContent,
      children,
      ...props
    },
    ref,
  ) => {
    const progress = Math.min(
      100,
      Math.max(0, Math.round((currentStep / totalSteps) * 100)),
    );

    const variants = {
      hidden: { opacity: 0, x: 60 },
      enter: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -60 },
    };

    return (
      <Card
        ref={ref}
        className={cn(
          multiStepFormVariants({ size }),
          "border border-white/60 bg-white/80 shadow-[0_24px_60px_-32px_rgba(92,70,39,0.45)] backdrop-blur",
          className,
        )}
        {...props}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              {stepLabel ? (
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  {stepLabel}
                </p>
              ) : null}
              <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {onClose ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full"
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>
          <div className="flex items-center gap-4 pt-1">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 24 }}
              />
            </div>
            <p className="whitespace-nowrap text-xs font-medium tabular-nums text-muted-foreground">
              {currentStep}/{totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent className="min-h-[320px] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              variants={variants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex flex-col-reverse gap-3 border-t border-border/60 bg-muted/30 pt-4 sm:flex-row sm:justify-between">
          <div className="text-sm text-muted-foreground">{footerContent}</div>
          <div className="flex w-full gap-2 sm:w-auto">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 rounded-full sm:flex-none"
              >
                {backButtonText}
              </Button>
            ) : null}
            <Button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className="flex-1 rounded-full sm:flex-none"
            >
              {nextButtonText}
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  },
);

MultiStepForm.displayName = "MultiStepForm";

export { MultiStepForm };
