"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { RouteGuard } from "@/components/providers/RouteGuard";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "@/components/molecules/Toaster";

export default function PartnerProfilePage() {
  const { user, updateMyProfile } = useAuth();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setCompanyName(user.companyName ?? "");
    }
  }, [user]);

  const dirty =
    user !== null &&
    (name.trim() !== (user.name ?? "") ||
      companyName.trim() !== (user.companyName ?? ""));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateMyProfile({
        name: name.trim(),
        companyName: companyName.trim() || undefined,
      });
      setMessage("Profile updated.");
      toast.success("Profile updated");
    } catch (e) {
      toast.error("Couldn't update profile", (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <RouteGuard allow={["partner"]}>
      <div className="space-y-8">
        <SectionHeading
          title="Your profile"
          subtitle="Update how your operator account appears across the platform."
        />

        <Card className="max-w-2xl border-white/60 bg-white/80 shadow-[0_18px_40px_-30px_rgba(92,70,39,0.35)]">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email</Label>
              <Input value={user?.email ?? ""} disabled />
              <p className="text-xs text-muted-foreground">
                Email is managed by your sign-in provider.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Display name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Company name</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your operator company"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={!dirty || saving || !name.trim()}
                className="rounded-full"
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
              {message ? (
                <span className="text-xs text-emerald-700">{message}</span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
