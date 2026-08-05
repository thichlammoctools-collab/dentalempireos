// vexp-hint: per-prompt orientation (fail-open). Managed by vexp.
const VEXP_BIN = "c:/Users/PNN/.vscode/extensions/vexp.vexp-vscode-2.4.0-win32-x64/binaries/vexp-core-win32-x64/vexp-core.exe";
export const VexpHint = async ({ directory }) => {
  return {
    "chat.message": async (_input, output) => {
      try {
        const { execFileSync } = await import("node:child_process");
        const text = (output.parts || [])
          .filter((p) => p && p.type === "text" && typeof p.text === "string")
          .map((p) => p.text)
          .join("\n");
        if (!text || text.length < 40) return;
        const out = execFileSync(VEXP_BIN, ["prompt-hint"], {
          input: JSON.stringify({ prompt: text }),
          timeout: 4000,
          env: { ...process.env, CLAUDE_PROJECT_DIR: directory },
          encoding: "utf8",
        });
        if (!out || !out.trim()) return;
        const hint = JSON.parse(out).hookSpecificOutput?.additionalContext;
        if (hint) output.parts.push({ type: "text", text: hint });
      } catch (e) { /* fail open */ }
    },
  };
};
