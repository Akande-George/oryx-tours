import "server-only";

const apiBase = process.env.MYFATOORAH_API_BASE;
const apiToken = process.env.MYFATOORAH_API_TOKEN;
const currency = process.env.MYFATOORAH_CURRENCY ?? "USD";

const requireEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
};

type MyFatoorahEnvelope<T> = {
  IsSuccess: boolean;
  Message?: string;
  ValidationErrors?: { Name: string; Error: string }[];
  Data?: T;
};

const call = async <T>(path: string, body: unknown): Promise<T> => {
  const res = await fetch(`${requireEnv(apiBase, "MYFATOORAH_API_BASE")}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireEnv(apiToken, "MYFATOORAH_API_TOKEN")}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = (await res.json()) as MyFatoorahEnvelope<T>;
  if (!json.IsSuccess || !json.Data) {
    const details =
      json.ValidationErrors?.map((v) => `${v.Name}: ${v.Error}`).join("; ") ??
      json.Message ??
      `HTTP ${res.status}`;
    throw new Error(`MyFatoorah ${path}: ${details}`);
  }
  return json.Data;
};

export type SendPaymentArgs = {
  invoiceValue: number;
  customerName: string;
  customerEmail?: string;
  customerReference: string;
  callbackUrl: string;
  errorUrl: string;
};

export type SendPaymentResult = {
  InvoiceId: number;
  InvoiceURL: string;
  CustomerReference?: string;
  UserDefinedField?: string;
};

export const sendPayment = (args: SendPaymentArgs) =>
  call<SendPaymentResult>("/v2/SendPayment", {
    NotificationOption: "LNK",
    InvoiceValue: args.invoiceValue,
    CustomerName: args.customerName,
    CustomerEmail: args.customerEmail,
    DisplayCurrencyIso: currency,
    Language: "en",
    CustomerReference: args.customerReference,
    CallBackUrl: args.callbackUrl,
    ErrorUrl: args.errorUrl,
  });

export type PaymentStatusResult = {
  InvoiceId: number;
  InvoiceStatus: "Paid" | "Failed" | "Pending" | string;
  InvoiceValue: number;
  CustomerReference?: string;
  InvoiceTransactions?: {
    PaymentId: string;
    TransactionStatus: string;
    TransactionDate: string;
  }[];
};

export type GetPaymentStatusArgs = {
  key: string;
  keyType: "PaymentId" | "InvoiceId";
};

export const getPaymentStatus = (args: GetPaymentStatusArgs) =>
  call<PaymentStatusResult>("/v2/GetPaymentStatus", {
    Key: args.key,
    KeyType: args.keyType,
  });
