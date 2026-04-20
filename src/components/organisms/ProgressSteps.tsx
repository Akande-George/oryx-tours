import { cn } from "@/lib/utils";

type ProgressStepsProps = {
  steps: string[];
  current: number;
};

export function ProgressSteps({ steps, current }: ProgressStepsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {steps.map((step, index) => {
        const state = index + 1;
        const active = state === current;
        const completed = state < current;
        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm",
                active && "border-primary bg-primary text-white",
                completed && "border-primary bg-primary/10 text-primary",
                !active && !completed && "border-border text-muted-foreground",
              )}
            >
              {state}
            </div>
            <p
              className={cn(
                "text-sm",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}
