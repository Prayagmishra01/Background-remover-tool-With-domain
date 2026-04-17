export interface ErrorLogPayload {
  timestamp: string;
  error_message: string;
  stack_trace: string;
  page_url: string;
  browser: string;
  device: string;
  action_history: string[];
  tool_stage: "upload" | "processing" | "download" | "general";
  severity: "low" | "medium" | "critical";
  // Extreme Details
  screen_resolution: string;
  viewport_size: string;
  pixel_ratio: number;
  language: string;
  connection: string;
  hardware_concurrency: string;
  device_memory: string;
  timezone: string;
  memory_usage: string;
}

let actionHistory: string[] = [];

function pushAction(action: string) {
  actionHistory.push(action);
  if (actionHistory.length > 5) {
    actionHistory.shift();
  }
}

// Track last user interaction for context
if (typeof window !== "undefined") {
  window.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const tagName = target?.tagName?.toLowerCase() || "unknown";
    const textContext = target?.innerText?.slice(0, 20) || "";
    const id = target?.id ? `#${target.id}` : '';
    const className = target?.className && typeof target.className === 'string' ? `.${target.className.split(' ')[0]}` : '';
    pushAction(`Click <${tagName}${id}${className}> ${textContext ? `"${textContext.replace(/\n/g, ' ')}"` : ""}`);
  }, { capture: true });

  window.addEventListener("error", (event) => {
    reportError(event.error || new Error(event.message), "general", "critical");
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), "general", "critical");
  });
}

// Ensure privacy by stripping sensitive data
function sanitizeString(str: string): string {
  if (!str) return "None";
  let sanitized = str.replace(/data:image\/[^;]+;base64,[a-zA-Z0-9+/=]+/ig, "[REDACTED_IMAGE_DATA]");
  sanitized = sanitized.replace(/blob:http[^\s]+/ig, "[REDACTED_BLOB_URL]");
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

function getExtremeDetails() {
  if (typeof window === "undefined") return {};
  const nav = window.navigator as any;
  let connectionInfo = "Unknown";
  if (nav.connection) {
    connectionInfo = `${nav.connection.effectiveType || ''} ${nav.connection.downlink ? `(${nav.connection.downlink}Mbps)` : ''}`;
  }
  
  let memoryStr = "Unknown";
  if (performance && (performance as any).memory) {
    const mem = (performance as any).memory;
    memoryStr = `Used: ${Math.round(mem.usedJSHeapSize / 1048576)}MB / Total: ${Math.round(mem.totalJSHeapSize / 1048576)}MB / Limit: ${Math.round(mem.jsHeapSizeLimit / 1048576)}MB`;
  }

  return {
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    pixel_ratio: window.devicePixelRatio || 1,
    language: window.navigator.language || "Unknown",
    connection: connectionInfo,
    hardware_concurrency: String(nav.hardwareConcurrency || "Unknown"),
    device_memory: nav.deviceMemory ? `${nav.deviceMemory}GB` : "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    memory_usage: memoryStr,
  };
}

export function reportError(
  error: Error | unknown,
  tool_stage: ErrorLogPayload["tool_stage"] = "general",
  severity: ErrorLogPayload["severity"] = "medium"
) {
  if (typeof window === "undefined") return;

  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error && error.stack ? error.stack : "No stack trace available";

    const basePayload = {
      timestamp: new Date().toISOString(),
      error_message: sanitizeString(errorMessage),
      stack_trace: sanitizeString(stackTrace),
      page_url: window.location.href,
      browser: getBrowserInfo(),
      device: getDeviceType(),
      action_history: [...actionHistory],
      tool_stage,
      severity,
    };

    const payload: ErrorLogPayload = {
      ...basePayload,
      ...getExtremeDetails()
    } as ErrorLogPayload;

    fetch("/api/telemetry/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch((apiError) => {
      console.warn("Failed to report error to telemetry", apiError);
    });

  } catch (e) {
    console.error("Critical error in error tracker", e);
  }
}

export function initGlobalErrorTracking() {
  // Initialization moved to global level to capture from start
}
