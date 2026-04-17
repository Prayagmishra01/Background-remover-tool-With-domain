export interface ErrorLogPayload {
  timestamp: string;
  error_message: string;
  stack_trace: string;
  page_url: string;
  browser: string;
  device: string;
  action: string;
  tool_stage: "upload" | "processing" | "download" | "general";
  severity: "low" | "medium" | "critical";
}

let lastAction = "none";

// Track last user interaction for context
if (typeof window !== "undefined") {
  window.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const tagName = target?.tagName?.toLowerCase() || "unknown";
    const textContext = target?.innerText?.slice(0, 20) || "";
    lastAction = `Clicked <${tagName}> ${textContext ? `"${textContext}"` : ""}`;
  }, { capture: true });
}

// Ensure privacy by stripping sensitive data
function sanitizeString(str: string): string {
  if (!str) return "";
  // Remove data URIs (e.g., base64 images)
  let sanitized = str.replace(/data:image\/[^;]+;base64,[a-zA-Z0-9+/=]+/ig, "[REDACTED_IMAGE_DATA]");
  // Remove object URLs
  sanitized = sanitized.replace(/blob:http[^\s]+/ig, "[REDACTED_BLOB_URL]");
  // Remove file system paths (Windows/Unix) just in case
  sanitized = sanitized.replace(/(C:\\Users\\[^\\]+|file:\/\/\/[^\s]+)/ig, "[REDACTED_LOCAL_PATH]");
  return sanitized;
}

function getBrowserInfo(): string {
  if (typeof window === "undefined") return "Server";
  return window.navigator.userAgent;
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "Server";
  const ua = window.navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "Mobile";
  return "Desktop";
}

export function reportError(
  error: Error | unknown,
  tool_stage: ErrorLogPayload["tool_stage"] = "general",
  severity: ErrorLogPayload["severity"] = "medium"
) {
  if (typeof window === "undefined") return;

  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error && error.stack ? error.stack : "No stack trace";

    const payload: ErrorLogPayload = {
      timestamp: new Date().toISOString(),
      error_message: sanitizeString(errorMessage),
      stack_trace: sanitizeString(stackTrace),
      page_url: window.location.href,
      browser: getBrowserInfo(),
      device: getDeviceType(),
      action: sanitizeString(lastAction),
      tool_stage,
      severity,
    };

    // Non-blocking async API call
    fetch("/api/telemetry/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true // Ensure execution even if page is unloading
    }).catch((apiError) => {
      // Silently catch to avoid UX disruption
      console.warn("Failed to report error to telemetry", apiError);
    });

  } catch (e) {
    console.error("Critical error in error tracker", e);
  }
}

// Global Handlers
export function initGlobalErrorTracking() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    reportError(event.error || event.message, "general", "critical");
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason, "general", "critical");
  });
}
