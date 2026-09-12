import { TOOL_POLICIES } from "./agentContracts.js";

function requiredText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${label} is required`);
  return value.trim();
}

export class ToolRegistry {
  #tools = new Map();

  register(definition) {
    if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
      throw new TypeError("tool definition must be an object");
    }
    const name = requiredText(definition.name, "tool.name");
    if (this.#tools.has(name)) throw new Error(`tool already registered: ${name}`);
    if (!Object.values(TOOL_POLICIES).includes(definition.policy)) {
      throw new TypeError(`unsupported tool policy: ${definition.policy}`);
    }
    if (!definition.inputSchema || typeof definition.inputSchema !== "object" || Array.isArray(definition.inputSchema)) {
      throw new TypeError("tool.inputSchema must be an object");
    }
    if (typeof definition.handler !== "function") throw new TypeError("tool.handler must be a function");

    const normalized = Object.freeze({
      name,
      description: typeof definition.description === "string" ? definition.description : "",
      inputSchema: structuredClone(definition.inputSchema),
      policy: definition.policy,
      handler: definition.handler,
    });
    this.#tools.set(name, normalized);
    return normalized;
  }

  get(name) {
    return this.#tools.get(name) ?? null;
  }

  has(name) {
    return this.#tools.has(name);
  }

  list() {
    return [...this.#tools.values()];
  }

  modelDefinitions() {
    return this.list().map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));
  }
}
