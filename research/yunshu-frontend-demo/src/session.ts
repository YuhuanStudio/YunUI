import { endpointError, type Thread, type Model } from "./data.ts";
export const sessionKey = "yunshu-workbench-demo-v2";
export interface Workspace { threads: Thread[]; items: Model[]; activeId: string; loaded: string|null; endpoint: string; dark: boolean }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
export function parseWorkspace(raw: string|null): Workspace | null {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if(!object(value) || !Array.isArray(value.items) || !value.items.length || !Array.isArray(value.threads) || !value.threads.length) return null;
    if(!value.items.every(item => object(item) && ["id","name","repo","size","context","kind"].every(key => typeof item[key] === "string"))) return null;
    const items = value.items as Model[];
    if(!value.threads.every(item => object(item) && typeof item.id === "string" && typeof item.title === "string" && typeof item.modelId === "string" && items.some(model => model.id === item.modelId) && typeof item.draft === "string" && typeof item.systemPrompt === "string" && typeof item.temperature === "number" && Number.isFinite(item.temperature) && item.temperature >= 0 && item.temperature <= 2 && Array.isArray(item.messages) && item.messages.every(message => object(message) && typeof message.id === "string" && ["user","assistant"].includes(String(message.role)) && typeof message.text === "string" && (message.modelId === undefined || typeof message.modelId === "string") && (message.code === undefined || typeof message.code === "string")))) return null;
    if(typeof value.activeId !== "string" || !value.threads.some(item => item.id === value.activeId) || (value.loaded !== null && !items.some(item => item.id === value.loaded)) || typeof value.endpoint !== "string" || endpointError(value.endpoint) || typeof value.dark !== "boolean") return null;
    if(new Set(items.map(item=>item.id)).size !== items.length || new Set(value.threads.map(item=>item.id)).size !== value.threads.length) return null;
    return value as unknown as Workspace;
  } catch { return null; }
}
export function readWorkspace(): Workspace | null {
  try { return parseWorkspace(sessionStorage.getItem(sessionKey)); } catch { return null; }
}
