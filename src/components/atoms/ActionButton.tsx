"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms";

type ActionButtonProps = {
  label: string;
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  action?: "alert" | "navigate" | "print";
  href?: string;
  message?: string;
};

export function ActionButton({
  label,
  className,
  variant = "default",
  action = "alert",
  href,
  message,
}: ActionButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (action === "print") {
      window.print();
      return;
    }

    if (action === "navigate" && href) {
      router.push(href);
      return;
    }

    window.alert(message ?? `${label} confirmed.`);
  };

  return (
    <Button className={className} variant={variant} onClick={handleClick}>
      {label}
    </Button>
  );
}
