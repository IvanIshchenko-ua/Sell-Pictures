type LogLevel = "INFO" | "WARN" | "ERROR";

type Serializable = Record<string, unknown>;

const redactKey = (key: string): boolean => {
  const normalized = key.toLowerCase();
  return normalized.includes("password") || normalized.includes("token") || normalized.includes("secret");
};

const redactValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(redactValue);
  if (!value || typeof value !== "object") return value;

  const safeObject: Serializable = {};
  for (const [key, item] of Object.entries(value as Serializable)) {
    safeObject[key] = redactKey(key) ? "[REDACTED]" : redactValue(item);
  }
  return safeObject;
};

const writeLog = (level: LogLevel, event: string, data?: Serializable) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(data ? { data: redactValue(data) } : {})
  };

  const line = JSON.stringify(payload);
  if (level === "ERROR") {
    console.error(line);
    return;
  }
  console.log(line);
};

export const securityLog = {
  info(event: string, data?: Serializable) {
    writeLog("INFO", event, data);
  },
  warn(event: string, data?: Serializable) {
    writeLog("WARN", event, data);
  },
  error(event: string, data?: Serializable) {
    writeLog("ERROR", event, data);
  }
};