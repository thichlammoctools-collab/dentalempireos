globalThis.process ??= {};
globalThis.process.env ??= {};
function isOpenAIUrl(url) {
  const u = url.toLowerCase();
  return u.includes("openai") || u.includes("v1/chat") || u.includes("zplay") || u.includes("openrouter") || u.includes("together");
}
async function chatCompletion(config, messages, systemPrompt) {
  const baseUrl = config.base_url.replace(/\/+$/, "");
  const apiKey = config.api_key;
  const model = config.model_id;
  const maxTokens = config.max_tokens || 8192;
  const cleanBase = baseUrl.replace(/\/+$/, "").replace(/\/v1$/, "");
  if (isOpenAIUrl(cleanBase)) {
    return chatOpenAI(cleanBase, apiKey, model, messages, systemPrompt, maxTokens);
  } else {
    return chatAnthropic(cleanBase, apiKey, model, messages, systemPrompt, maxTokens);
  }
}
async function chatOpenAI(baseUrl, apiKey, model, messages, systemPrompt, maxTokens) {
  const allMessages = [];
  if (systemPrompt) allMessages.push({ role: "system", content: systemPrompt });
  allMessages.push(...messages);
  const body = {
    model,
    messages: allMessages
  };
  body.max_tokens = maxTokens;
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const resp = await fetch(`${cleanBase}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`OpenAI API error (${resp.status}): ${err}`);
  }
  const data = await resp.json();
  const content = data.choices[0]?.message?.content;
  if (content === null || content === void 0) throw new Error("Empty response from OpenAI API");
  return content;
}
async function chatAnthropic(baseUrl, apiKey, model, messages, systemPrompt, maxTokens) {
  const anthropicMessages = messages.map((m) => ({
    role: "user",
    content: m.content
  }));
  const body = {
    model,
    max_tokens: maxTokens,
    messages: anthropicMessages
  };
  if (systemPrompt) body.system = systemPrompt;
  const resp = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Anthropic API error (${resp.status}): ${err}`);
  }
  const data = await resp.json();
  const text = data.content.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n");
  if (!text) throw new Error("Empty response from Anthropic API");
  return text;
}
export {
  chatCompletion as c
};
