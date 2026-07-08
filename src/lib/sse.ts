/**
 * SSE (Server-Sent Events) utilities for streaming responses to the client.
 */

export interface SSEMessage {
  event?: string;
  data: unknown;
}

function encodeEvent(event?: string, data: unknown): Uint8Array {
  const encoder = new TextEncoder();
  let str = '';
  if (event) str += `event: ${event}\n`;
  str += `data: ${JSON.stringify(data)}\n\n`;
  return encoder.encode(str);
}

/**
 * Build a ReadableStream from an async generator of SSE event objects.
 */
export function createSSEStream(
  events: AsyncGenerator<SSEMessage>,
): ReadableStream {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await events.next();
      if (done) {
        controller.close();
        return;
      }
      controller.enqueue(encodeEvent(value.event, value.data));
    },
  });
}

/**
 * Create a simple SSE stream that yields a single event.
 */
export function singleSSEStream(event: string, data: unknown): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encodeEvent(event, data));
      controller.close();
    },
  });
}

/**
 * Build a Response with SSE headers.
 */
export function sseResponse(stream: ReadableStream, init?: ResponseInit): Response {
  return new Response(stream, {
    ...init,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
}

/**
 * SSE helper: enqueue a message on a controller.
 */
export function sseEnqueue(
  controller: ReadableStreamDefaultController,
  event: string,
  data: unknown,
) {
  controller.enqueue(encodeEvent(event, data));
}
