globalThis.process ??= {};
globalThis.process.env ??= {};
const PAYOS_BASE_URL = "https://api-merchant.payos.vn";
async function generateSignature(data, checksumKey) {
  const sortedKeys = Object.keys(data).sort();
  const message = sortedKeys.map((k) => `${k}=${data[k]}`).join("&");
  const encoder = new TextEncoder();
  const keyData = encoder.encode(checksumKey);
  const msgData = encoder.encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifySignature(data, receivedSignature, checksumKey) {
  const expected = await generateSignature(data, checksumKey);
  return expected === receivedSignature;
}
function headers(creds, contentType = true) {
  const h = {
    "x-client-id": creds.PAYOS_CLIENT_ID,
    "x-api-key": creds.PAYOS_API_KEY
  };
  if (contentType) h["Content-Type"] = "application/json";
  return h;
}
async function createPaymentLink(creds, params) {
  const signature = await generateSignature(
    {
      amount: params.amount,
      cancelUrl: params.cancelUrl,
      description: params.description,
      orderCode: params.orderCode,
      returnUrl: params.returnUrl
    },
    creds.PAYOS_CHECKSUM_KEY
  );
  const resp = await fetch(`${PAYOS_BASE_URL}/v2/payment-requests`, {
    method: "POST",
    headers: headers(creds),
    body: JSON.stringify({ ...params, signature })
  });
  const json = await resp.json();
  if (!resp.ok || json.code !== "00") {
    throw new Error(`PayOS create payment failed: ${JSON.stringify(json)}`);
  }
  return json;
}
async function cancelPaymentLink(creds, paymentLinkId) {
  const resp = await fetch(`${PAYOS_BASE_URL}/v2/payment-requests/${paymentLinkId}/cancel`, {
    method: "POST",
    headers: headers(creds)
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(`PayOS cancel failed: ${JSON.stringify(body)}`);
  }
}
async function registerWebhook(creds) {
  const resp = await fetch(`${PAYOS_BASE_URL}/confirm-webhook`, {
    method: "POST",
    headers: headers(creds),
    body: JSON.stringify({ webhookUrl: creds.PAYOS_WEBHOOK_URL })
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(`PayOS register webhook failed: ${JSON.stringify(body)}`);
  }
  const json = await resp.json();
  return json.data;
}
export {
  createPaymentLink as a,
  cancelPaymentLink as c,
  registerWebhook as r,
  verifySignature as v
};
