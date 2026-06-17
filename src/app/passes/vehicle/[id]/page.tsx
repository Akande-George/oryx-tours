import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { PrintTrigger } from "@/components/passes/PrintTrigger";
import type { Operator, Vehicle } from "@/types";

type PassPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ auto?: string }>;
};

const qrUrl = (data: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;

export const dynamic = "force-dynamic";

export default async function VehiclePassPage({
  params,
  searchParams,
}: PassPageProps) {
  const { id } = await params;
  const { auto } = await searchParams;
  const supabase = await createSupabaseServerClient();

  const vehicleResp = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const vehicle = vehicleResp.data as Vehicle | null;

  if (!vehicle) return notFound();

  const operatorResp = await supabase
    .from("operators")
    .select("*")
    .eq("id", vehicle.operatorId)
    .maybeSingle();
  const operator = operatorResp.data as Operator | null;

  const photos = vehicle.images.slice(0, 3);

  return (
    <article className="pass-card">
      <header className="pass-header">
        <p className="pass-eyebrow">Oryx Tours · Fleet pass</p>
        <h1>{vehicle.name}</h1>
        <p style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
          {vehicle.fleetCategory} · {vehicle.capacity} pax · {vehicle.luggage}
        </p>
      </header>

      <div className="pass-body">
        {photos.length ? (
          <div className="pass-photos">
            {photos.map((src, idx) => (
              <img
                key={src + idx}
                src={src}
                alt={`${vehicle.name} ${idx + 1}`}
              />
            ))}
          </div>
        ) : null}

        <div className="pass-grid">
          <div>
            <p className="label">Half day</p>
            <p className="value">{formatPrice(vehicle.halfDayPrice)}</p>
          </div>
          <div>
            <p className="label">Full day</p>
            <p className="value">{formatPrice(vehicle.fullDayPrice)}</p>
          </div>
          <div>
            <p className="label">Extra hour</p>
            <p className="value">{formatPrice(vehicle.extraHourPrice)}</p>
          </div>
          <div>
            <p className="label">Airport transfer</p>
            <p className="value">{formatPrice(vehicle.transferPrice)}</p>
          </div>
        </div>

        {vehicle.features.length ? (
          <>
            <p
              className="label"
              style={{
                marginTop: 18,
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(60, 40, 20, 0.55)",
              }}
            >
              Features
            </p>
            <div className="pass-features">
              {vehicle.features.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </>
        ) : null}

        <div className="pass-qr">
          <img src={qrUrl(vehicle.id)} alt={`QR ${vehicle.name}`} />
          <span className="pass-qr-caption">
            Fleet ID · scan to verify
          </span>
        </div>

        {operator ? (
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgba(60, 40, 20, 0.6)",
              marginTop: 8,
            }}
          >
            Operated by <strong>{operator.name}</strong> ·{" "}
            {operator.rating.toFixed(1)}★ ·{" "}
            {operator.languages?.join(", ") ?? ""}
          </p>
        ) : null}

        <PrintTrigger auto={auto === "1"} />
      </div>

      <footer className="pass-footer">
        Oryx Group fleet · info@oryxgp.com
      </footer>
    </article>
  );
}
