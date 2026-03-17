"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityLog = void 0;
const redactKey = (key) => {
    const normalized = key.toLowerCase();
    return normalized.includes("password") || normalized.includes("token") || normalized.includes("secret");
};
const redactValue = (value) => {
    if (Array.isArray(value))
        return value.map(redactValue);
    if (!value || typeof value !== "object")
        return value;
    const safeObject = {};
    for (const [key, item] of Object.entries(value)) {
        safeObject[key] = redactKey(key) ? "[REDACTED]" : redactValue(item);
    }
    return safeObject;
};
const writeLog = (level, event, data) => {
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
exports.securityLog = {
    info(event, data) {
        writeLog("INFO", event, data);
    },
    warn(event, data) {
        writeLog("WARN", event, data);
    },
    error(event, data) {
        writeLog("ERROR", event, data);
    }
};
