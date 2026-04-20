"use client";

import { CreditCard, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function PaymentMethods() {
  return (
    <RadioGroup defaultValue="card" className="space-y-3">
      <Label className="flex items-center justify-between rounded-xl border border-border bg-white/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="card" />
          <div>
            <p className="text-sm font-semibold">Card payment</p>
            <p className="text-xs text-muted-foreground">
              Visa, Mastercard, Amex
            </p>
          </div>
        </div>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </Label>
      <Label className="flex items-center justify-between rounded-xl border border-border bg-white/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="wallet" />
          <div>
            <p className="text-sm font-semibold">Digital wallet</p>
            <p className="text-xs text-muted-foreground">
              Apple Pay or Google Pay
            </p>
          </div>
        </div>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </Label>
    </RadioGroup>
  );
}
