export type Page = "overview" | "chat" | "models" | "requests" | "api" | "settings";
export interface Model {
  id: string; name: string; repo: string; size: string; context: string; kind: string;
}
export interface Message { id: string; role: "user" | "assistant"; text: string; modelId?: string; code?: string }
export interface Thread { id: string; title: string; modelId: string; messages: Message[]; draft: string; temperature: number; systemPrompt: string }
export const models: Model[] = [
  { id: "qwen", name: "Qwen3.8 27B", repo: "Jundot/Qwen3.8-27B-oQ4e-mtp", size: "16.4 GB", context: "128K", kind: "文字 / 視覺" },
  { id: "qwen-small", name: "Qwen3.5 9B", repo: "mlx-community/Qwen3.5-9B-MLX-4bit", size: "5.8 GB", context: "128K", kind: "文字 / 視覺" },
  { id: "llama", name: "Llama 3.2 3B", repo: "mlx-community/Llama-3.2-3B-Instruct-4bit", size: "1.9 GB", context: "128K", kind: "文字" },
];
export const makeThread = (id: string, modelId = "qwen"): Thread => ({ id, title: "新對話", modelId, messages: [], draft: "", temperature: 0.7, systemPrompt: "" });
export const initialThreads: Thread[] = [makeThread("new"), {
  ...makeThread("guide"), title: "用 Python 連接 Yunshu",
  messages: [
    { id: "guide-u", role: "user", text: "如何用 Python 呼叫本機的 Yunshu？" },
    { id: "guide-a", role: "assistant", modelId: "qwen", text: "使用 OpenAI 相容的 SDK，將 base_url 指向本機服務即可。下面是最小範例。\n\n這是預先準備的範例對話，尚未呼叫推理引擎。", code: 'from openai import OpenAI\n\nclient = OpenAI(\n    base_url="http://127.0.0.1:8000/v1",\n    api_key="local",\n)\nresponse = client.chat.completions.create(\n    model="local",\n    messages=[{"role": "user", "content": "Hello, Yunshu."}],\n)' },
  ],
}];
export const modelName = (id: string) => models.find(model => model.id === id)?.name ?? id;
export function routeFromHash(): { page: Page; threadId?: string } {
  const [path, threadId] = location.hash.replace(/^#\/?/, "").split("/");
  return { page: ["overview", "chat", "models", "requests", "api", "settings"].includes(path) ? path as Page : "overview", threadId };
}
export function endpointError(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return "請使用 http:// 或 https:// 位址。";
    if (url.username || url.password) return "請勿把帳號或密碼寫在服務位址中。";
    if (url.search || url.hash) return "服務位址不應包含查詢參數或錨點。";
  } catch { return "請輸入有效的服務位址，例如 http://127.0.0.1:8000。"; }
}
export function apiBase(endpoint: string): string {
  const base = endpoint.trim().replace(/\/+$/, "");
  return base.endsWith("/v1") ? base : `${base}/v1`;
}
