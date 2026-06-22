// PayOS API client — Cloudflare Workers compatible (Web Crypto API, no Node.js crypto)

const PAYOS_BASE_URL = 'https://api-merchant.payos.vn';

// ── Types ────────────────────────────────────────────────────

export interface PayOSCreatePaymentParams {
  orderCode: number;
  amount: number;
  description: string;
  cancelUrl: string;
  returnUrl: string;
}

export interface PayOSPaymentLinkResponse {
  code: string;
  message: string;
  data: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    paymentLinkId: string;
    status: string;
    checkoutUrl: string;
    qrCode: string;
    expiredAt: number | null;
    createdDate: string;
  };
}

export interface PayOSPaymentInfoResponse {
  id: string;
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  createdAt: string;
  transactions: Array<{
    reference: string;
    amount: number;
    accountNumber: string;
    accountName: string;
    transactionDateTime: string;
    virtualAccountName?: string;
    virtualAccountNumber?: string;
  }>;
  cancellation?: {
    cancellationReason: string;
    cancelledAt: string;
  };
}

// ── Signature ────────────────────────────────────────────────

/**
 * Generate HMAC-SHA256 signature using Web Crypto API (Workers-compatible).
 * Params must be sorted alphabetically and joined as "key=value&key=value".
 */
export async function generateSignature(
  data: Record<string, string | number>,
  checksumKey: string,
): Promise<string> {
  const sortedKeys = Object.keys(data).sort();
  const message = sortedKeys.map((k) => `${k}=${data[k]}`).join('&');

  const encoder = new TextEncoder();
  const keyData = encoder.encode(checksumKey);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify an HMAC-SHA256 signature from PayOS webhook.
 */
export async function verifySignature(
  data: Record<string, string | number>,
  receivedSignature: string,
  checksumKey: string,
): Promise<boolean> {
  const expected = await generateSignature(data, checksumKey);
  return expected === receivedSignature;
}

// ── API Calls ────────────────────────────────────────────────

/** Credentials interface — populated from D1 payos_settings or env vars */
export interface PayosCredentials {
  PAYOS_CLIENT_ID: string;
  PAYOS_API_KEY: string;
  PAYOS_CHECKSUM_KEY: string;
  PAYOS_WEBHOOK_URL: string;
}

function headers(creds: PayosCredentials, contentType = true): Record<string, string> {
  const h: Record<string, string> = {
    'x-client-id': creds.PAYOS_CLIENT_ID,
    'x-api-key': creds.PAYOS_API_KEY,
  };
  if (contentType) h['Content-Type'] = 'application/json';
  return h;
}

/** Create a payment link via PayOS */
export async function createPaymentLink(
  creds: PayosCredentials,
  params: PayOSCreatePaymentParams,
): Promise<PayOSPaymentLinkResponse> {
  const signature = await generateSignature(
    {
      amount: params.amount,
      cancelUrl: params.cancelUrl,
      description: params.description,
      orderCode: params.orderCode,
      returnUrl: params.returnUrl,
    },
    creds.PAYOS_CHECKSUM_KEY,
  );

  const resp = await fetch(`${PAYOS_BASE_URL}/v2/payment-requests`, {
    method: 'POST',
    headers: headers(creds),
    body: JSON.stringify({ ...params, signature }),
  });

  const json = (await resp.json()) as PayOSPaymentLinkResponse;
  if (!resp.ok || json.code !== '00') {
    throw new Error(`PayOS create payment failed: ${JSON.stringify(json)}`);
  }
  return json;
}

/** Cancel a payment link */
export async function cancelPaymentLink(
  creds: PayosCredentials,
  paymentLinkId: string,
): Promise<void> {
  const resp = await fetch(`${PAYOS_BASE_URL}/v2/payment-requests/${paymentLinkId}/cancel`, {
    method: 'POST',
    headers: headers(creds),
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(`PayOS cancel failed: ${JSON.stringify(body)}`);
  }
}

/** Get payment link info */
export async function getPaymentInfo(
  creds: PayosCredentials,
  paymentLinkId: string,
): Promise<PayOSPaymentInfoResponse> {
  const resp = await fetch(`${PAYOS_BASE_URL}/v2/payment-requests/${paymentLinkId}`, {
    headers: headers(creds, false),
  });
  if (!resp.ok) {
    throw new Error(`PayOS get info failed: ${resp.status}`);
  }
  const json = (await resp.json()) as { data: PayOSPaymentInfoResponse };
  return json.data;
}

/** Register webhook URL with PayOS */
export async function registerWebhook(
  creds: PayosCredentials,
): Promise<{ webhookUrl: string; accountNumber: string; accountName: string }> {
  const resp = await fetch(`${PAYOS_BASE_URL}/confirm-webhook`, {
    method: 'POST',
    headers: headers(creds),
    body: JSON.stringify({ webhookUrl: creds.PAYOS_WEBHOOK_URL }),
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(`PayOS register webhook failed: ${JSON.stringify(body)}`);
  }
  const json = (await resp.json()) as {
    data: { webhookUrl: string; accountNumber: string; accountName: string };
  };
  return json.data;
}
